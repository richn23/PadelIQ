import { runSignal } from '../rating.js';
import React, { useState } from 'react';
import think from '../assets/mascot-think.png';
import CoachChat from '../components/CoachChat.jsx';
import { allSkillById } from '../data.js';
import { nextPlanned, sessionSummary, preMatchOpener, postMatchOpener } from '../coach.js';
import { recentSessions } from '../checkin.js';
import { withThread, setThreadResult, openThreads } from '../threads.js';
import { MAX_GOALS, addGoalTo, parkGoalIn } from '../goals.js';

const MODES = [
  { id: 'pre_match', name: 'Pre-match', what: 'Short and clear: 2 or 3 things to think about for your next session.' },
  { id: 'post_match', name: 'Post-match', what: 'Talk through your last game or lesson.' },
  { id: 'ask', name: 'Ask the coach', what: 'Any padel question: a shot, tactics, rules, even rackets.' },
  { id: 'mindset', name: 'Mindset', what: 'Nerves, focus and bouncing back.' },
];

export default function Coach({ player, updatePlayer, start, onGoSkills, howTo = 'full' }) {
  const [followUp, setFollowUp] = useState(null); // thread being followed up in a chat
  const [mode, setMode] = useState(start?.mode || null);
  const [skillId, setSkillId] = useState(start?.skillId || null);
  const goalSkills = [...new Set((player.goals || []).map((g) => g.skillId).filter(Boolean))];
  const next = nextPlanned(player);
  const last = recentSessions(player, 1)[0];

  const saveProposal = (p) => {
    if (!updatePlayer) return false;
    if (p.type === 'thread') { updatePlayer((pl) => withThread(pl, p)); return 'Saved. Find it on the Coach tab, under Last time.'; }
    if (p.type === 'goal') {
      if ((player.goals || []).length >= MAX_GOALS) return 'You already have 3 goals going. Park one first, then I can add this.';
      const known = allSkillById[p.skillId];
      const title = String(p.title || '').slice(0, 80);
      if (!known && !title) return;
      updatePlayer((pl) => addGoalTo(pl, { ...(known ? { skillId: p.skillId, title } : { own: true, title }), now: String(p.now || '').slice(0, 120), want: String(p.want || '').slice(0, 120) }));
      return 'Added to your goals.';
    }
    if (p.type === 'park_goal') {
      const g = (player.goals || []).find((x) => x.id === p.goalId) || (player.goals || []).find((x) => p.skillId && x.skillId === p.skillId);
      if (!g) return;
      updatePlayer((pl) => parkGoalIn(pl, g.id));
      return 'Parked. You can pick it up again from Goals.';
    }
    if (p.type === 'reflection' && last) {
      const n = p.notes || {};
      const merge = (a, b) => (b ? (a ? `${a} ${b}` : b) : a || '');
      updatePlayer((pl) => ({ ...pl, sessions: (pl.sessions || []).map((x) => (x.id === last.id ? { ...x, notes: { worked: merge(x.notes?.worked, n.worked), didnt: merge(x.notes?.didnt, n.didnt), tryNext: merge(x.notes?.tryNext, n.tryNext) }, tags: [...new Set([...(x.tags || []), ...(p.tags || [])])] } : x)) }));
      return 'Saved to your last game.';
    }
    return false;
  };
  const answer = (t, status) => {
    updatePlayer?.((pl) => setThreadResult(pl, t.id, status));
    if (status === 'partly' || status === 'no_help') { setFollowUp({ ...t, status }); setMode('follow_up'); }
  };

  if (mode === 'follow_up' && followUp) {
    const vars = { skill_name: followUp.topic, skill_id: '', thread_id: followUp.id, result: followUp.status === 'partly' ? 'it helped a bit' : "it didn't help" };
    return (
      <main className="page">
        <button className="back" onClick={() => { setMode(null); setFollowUp(null); }}>‹ Coach</button>
        <CoachChat key={'fu' + followUp.id} mode="follow_up" title={`Follow-up: ${followUp.topic}`} vars={vars} player={player} onProposal={saveProposal} accepts={['thread', 'goal', 'park_goal', 'reflection']}
          intro={followUp.status === 'partly' ? `Good, a bit of progress. What did you notice when you tried it?` : `Thanks for telling me. What happened when you tried it?`} />
      </main>
    );
  }

  if (mode) {
    if (mode === 'deep_dive' && !skillId) {
      return (
        <main className="page">
          <button className="back" onClick={() => setMode(null)}>‹ Coach</button>
          <section className="panel">
            <p className="eyebrow">Explain a skill: which one?</p>
            <div className="chips" style={{ marginTop: 8 }}>
              {goalSkills.map((id) => <button key={id} className="chip-btn skill" onClick={() => setSkillId(id)}>{allSkillById[id]?.name}</button>)}
            </div>
            <p className="soft" style={{ marginTop: 8 }}>{goalSkills.length ? 'Your goals are listed. ' : ''}For any other skill, open it on the Skills tab and tap "Dive in with the coach".</p>
            <button className="btn ghost" onClick={onGoSkills}>Go to Skills</button>
          </section>
        </main>
      );
    }
    const skill = skillId ? allSkillById[skillId] : null;
    const vars = {
      session_summary: mode === 'pre_match' ? (next ? sessionSummary(next) : 'No session planned. Give a general brief for their next game.') : mode === 'post_match' ? (last ? sessionSummary(last, runSignal(player)) : 'No session logged yet.') : '',
      skill_name: skill?.name || '',
      skill_id: skill?.id || '',
    };
    const title = MODES.find((m) => m.id === mode)?.name + (skill ? `: ${skill.name}` : '');
    return (
      <main className="page">
        <button className="back" onClick={() => { setMode(null); setSkillId(null); }}>‹ Coach</button>
        <CoachChat key={mode + (skillId || '')} mode={mode} title={title} vars={vars} player={player} skill={skill} onProposal={saveProposal} accepts={['thread', 'goal', 'park_goal', 'reflection']} opener={start?.opener} intro={mode === 'pre_match' ? preMatchOpener(player, next) : mode === 'post_match' ? postMatchOpener(last, runSignal(player)) : mode === 'ask' ? "What's your question today? Anything about padel: a shot, tactics, rules, even rackets." : mode === 'mindset' ? "What's on your mind? Nerves, focus, frustration, anything." : undefined} />
      </main>
    );
  }

  return (
    <main className="page">
      <div className="mascot-row">
        <img className="mascot-img" src={think} alt="" />
        <div className="bubble">How can I help today?</div>
      </div>
      {openThreads(player).slice(-2).map((t) => (
        <section className="panel" key={t.id}>
          <p className="eyebrow">Last time · {t.topic}</p>
          <p className="soft">{t.advice[0]}</p>
          <p className="insight">Did it help?</p>
          <div className="row-gap">
            <button className="mini on" onClick={() => answer(t, 'helped')}>Yes</button>
            <button className="mini" onClick={() => answer(t, 'partly')}>A bit</button>
            <button className="mini" onClick={() => answer(t, 'no_help')}>Not really</button>
            <button className="mini quiet" onClick={() => answer(t, 'not_tried')}>Haven't tried</button>
          </div>
        </section>
      ))}
      <section className="panel">
        <p className="eyebrow">Talk to the coach</p>
        <ul className="list">
          {MODES.map((m) => (
            <li key={m.id}>
              <button className="list-row link col" onClick={() => setMode(m.id)}>
                <strong>{m.name}</strong>
                <span className="soft">{m.what}</span>
              </button>
            </li>
          ))}
        </ul>
        {howTo === 'full' && <p className="soft">Want a skill explained? Open it in Skills and tap "Dive in with the coach".</p>}
      </section>
    </main>
  );
}

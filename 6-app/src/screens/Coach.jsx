import React, { useState } from 'react';
import think from '../assets/mascot-think.png';
import CoachChat from '../components/CoachChat.jsx';
import { allSkillById } from '../data.js';
import { nextPlanned, sessionSummary, preMatchOpener, postMatchOpener } from '../coach.js';
import { recentSessions } from '../checkin.js';
import { withThread, setThreadResult, openThreads } from '../threads.js';

const MODES = [
  { id: 'pre_match', name: 'Pre-match', what: 'Short and clear: 2 or 3 things to think about for your next session.' },
  { id: 'post_match', name: 'Post-match', what: 'Asks questions to help you reflect on your last session. No advice.' },
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

  const saveProposal = (p) => { if (p.type === 'thread' && updatePlayer) updatePlayer((pl) => withThread(pl, p)); };
  const answer = (t, status) => {
    updatePlayer?.((pl) => setThreadResult(pl, t.id, status));
    if (status === 'partly' || status === 'no_help') { setFollowUp({ ...t, status }); setMode('follow_up'); }
  };

  if (mode === 'follow_up' && followUp) {
    const vars = { skill_name: followUp.topic, skill_id: '', thread_id: followUp.id, result: followUp.status === 'partly' ? 'it helped a bit' : "it didn't help" };
    return (
      <main className="page">
        <button className="back" onClick={() => { setMode(null); setFollowUp(null); }}>‹ Coach</button>
        <CoachChat key={'fu' + followUp.id} mode="follow_up" title={`Follow-up: ${followUp.topic}`} vars={vars} player={player} onProposal={saveProposal}
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
            <p className="soft" style={{ marginTop: 8 }}>{goalSkills.length ? 'Your goals are listed. ' : ''}For any other skill, open it on the Skills tab and tap "Explain this skill".</p>
            <button className="btn ghost" onClick={onGoSkills}>Go to Skills</button>
          </section>
        </main>
      );
    }
    const skill = skillId ? allSkillById[skillId] : null;
    const vars = {
      session_summary: mode === 'pre_match' ? (next ? sessionSummary(next) : 'No session planned. Give a general brief for their next game.') : mode === 'post_match' ? (last ? sessionSummary(last) : 'No session logged yet.') : '',
      skill_name: skill?.name || '',
      skill_id: skill?.id || '',
    };
    const title = MODES.find((m) => m.id === mode)?.name + (skill ? `: ${skill.name}` : '');
    return (
      <main className="page">
        <button className="back" onClick={() => { setMode(null); setSkillId(null); }}>‹ Coach</button>
        <CoachChat key={mode + (skillId || '')} mode={mode} title={title} vars={vars} player={player} skill={skill} onProposal={saveProposal} opener={start?.opener} intro={mode === 'pre_match' ? preMatchOpener(player, next) : mode === 'post_match' ? postMatchOpener(last) : mode === 'ask' ? "What's your question today? Anything about padel: a shot, tactics, rules, even rackets." : mode === 'mindset' ? "What's on your mind? Nerves, focus, frustration, anything." : undefined} />
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
        {howTo === 'full' && <p className="soft">To understand one skill, open it on the Skills tab and tap "Explain this skill". Goal setting and placing your level live there too.</p>}
      </section>
      <section className="panel">
        <p className="eyebrow">Inbox</p>
        <p className="soft">Tips and patterns from your notes will land here. Coming soon.</p>
      </section>
    </main>
  );
}

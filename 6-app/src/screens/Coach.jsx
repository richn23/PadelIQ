import React, { useState } from 'react';
import think from '../assets/mascot-think.png';
import CoachChat from '../components/CoachChat.jsx';
import { allSkillById } from '../data.js';
import { nextPlanned, sessionSummary, preMatchOpener } from '../coach.js';
import { recentSessions } from '../checkin.js';

const MODES = [
  { id: 'pre_match', name: 'Pre-match', what: 'Short and clear: 2 or 3 things to think about for your next session.' },
  { id: 'post_match', name: 'Post-match', what: 'Asks questions to help you reflect on your last session. No advice.' },
  { id: 'deep_dive', name: 'Deep dive', what: 'Pick a skill. Explains it and suggests practice at your level.' },
  { id: 'mindset', name: 'Mindset', what: 'Nerves, focus and bouncing back.' },
];

export default function Coach({ player, start, onGoSkills }) {
  const [mode, setMode] = useState(start?.mode || null);
  const [skillId, setSkillId] = useState(start?.skillId || null);
  const goalSkills = [...new Set((player.goals || []).map((g) => g.skillId))];
  const next = nextPlanned(player);
  const last = recentSessions(player, 1)[0];

  if (mode) {
    if (mode === 'deep_dive' && !skillId) {
      return (
        <main className="page">
          <button className="back" onClick={() => setMode(null)}>‹ Coach</button>
          <section className="panel">
            <p className="eyebrow">Deep dive: which skill?</p>
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
        <CoachChat key={mode + (skillId || '')} mode={mode} title={title} vars={vars} player={player} skill={skill} opener={start?.opener} intro={mode === 'pre_match' ? preMatchOpener(player, next) : undefined} />
      </main>
    );
  }

  return (
    <main className="page">
      <div className="mascot-row">
        <img className="mascot-img" src={think} alt="" />
        <div className="bubble">How can I help today?</div>
      </div>
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
        <p className="soft">Goal setting and placing your level live on each skill's page.</p>
      </section>
      <section className="panel">
        <p className="eyebrow">Inbox</p>
        <p className="soft">Tips and patterns from your notes will land here. Coming soon.</p>
      </section>
    </main>
  );
}

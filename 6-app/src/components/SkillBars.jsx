import React, { useState } from 'react';
import { levels } from '../data.js';
import { levelOrder, levelByOrder, scoreLabel, skillScore } from '../levels.js';

// Progress bars for skills: Beginner to A, with + and − inside each level.
// In "adjust" mode each bar becomes a slider in thirds of a level (C−, C, C+).

const RATED = levels.filter((l) => l.id !== 'Pro');
const MAX = RATED.length * 3 - 1; // slider steps: Beginner− … A+
const toStep = (score) => Math.min(Math.max(Math.round((score + 1 / 3) * 3), 0), MAX);
const fromStep = (step) => ({ level: levelByOrder(Math.floor(step / 3)).id, adj: (step % 3) - 1 });
const stepScore = (step) => Math.floor(step / 3) + 0.3 * ((step % 3) - 1);
const pct = (score) => `${Math.min(Math.max(((score + 0.5) / RATED.length) * 100, 3), 100)}%`;

export function SkillBar({ skill, check, level, editing, onSet, onOpen }) {
  const score = check ? skillScore(skill, check, level) : null;
  const [step, setStep] = useState(toStep(score ?? levelOrder(level)));
  const shown = editing ? stepScore(step) : score;
  return (
    <li className="skillbar">
      <div className="skillbar-top">
        {onOpen ? <button className="skillbar-name" onClick={() => onOpen(skill.id)}>{skill.name}</button> : <span className="skillbar-name">{skill.name}</span>}
        <span className={'skillbar-label' + (shown === null ? ' empty' : '')}>{shown === null ? 'Not checked' : scoreLabel(shown)}</span>
      </div>
      <div className="skillbar-track" aria-hidden={editing}>
        {RATED.map((l, i) => <span key={l.id} className="skillbar-tick" style={{ left: `${((i + 0.5) / RATED.length) * 100}%` }} />)}
        {shown !== null && <span className="skillbar-fill" style={{ width: pct(shown) }} />}
        {editing && (
          <input
            type="range" min="0" max={MAX} step="1" value={step}
            aria-label={`${skill.name}: ${scoreLabel(stepScore(step))}`}
            onChange={(e) => setStep(Number(e.target.value))}
            onPointerUp={() => onSet(skill, fromStep(step))}
            onKeyUp={() => onSet(skill, fromStep(step))}
            onTouchEnd={() => onSet(skill, fromStep(step))}
          />
        )}
      </div>
    </li>
  );
}

export function LevelScale() {
  return (
    <div className="skillbar-scale" aria-hidden="true">
      {RATED.map((l) => <span key={l.id}>{l.id === 'beginner' ? 'Beg' : l.name}</span>)}
    </div>
  );
}

// A list of bars with an "Adjust" switch. onSet(skill, { level, adj }) saves a self-rating.
export default function SkillBars({ title, skills, checks, level, onOpen, onSet, note }) {
  const [editing, setEditing] = useState(false);
  return (
    <section className="panel">
      <div className="row-between">
        <p className="eyebrow">{title}</p>
        {onSet && skills.length > 0 && <button className={'mini' + (editing ? ' on' : '')} onClick={() => setEditing(!editing)}>{editing ? 'Done' : 'Adjust'}</button>}
      </div>
      {editing && <p className="soft">Slide to where you think you are. It saves as you go, and it's your call: you can always re-check with questions on a skill's page.</p>}
      {note && !editing && <p className="soft">{note}</p>}
      {skills.length === 0 ? <p className="soft">Nothing here yet.</p> : (
        <>
          <LevelScale />
          <ul className="skillbars">
            {skills.map((s) => <SkillBar key={s.id + (editing ? '-e' : '')} skill={s} check={checks[s.id]} level={level} editing={editing} onSet={onSet} onOpen={editing ? null : onOpen} />)}
          </ul>
        </>
      )}
    </section>
  );
}

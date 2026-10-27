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
  const [touched, setTouched] = useState(false);
  const rated = score !== null || touched;
  const shown = editing ? (rated ? stepScore(step) : null) : score;
  const commit = () => { setTouched(true); onSet(skill, fromStep(step)); };
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
            type="range" min="0" max={MAX} step="1" value={step} className={rated ? '' : 'unrated'}
            aria-label={`${skill.name}: ${scoreLabel(stepScore(step))}`}
            onChange={(e) => setStep(Number(e.target.value))}
            onPointerUp={commit}
            onClick={commit}
            onKeyUp={commit}
            onTouchEnd={commit}
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

// A list of bars you can slide directly. onSet(skill, { level, adj }) saves a self-rating.
export default function SkillBars({ title, skills, checks, level, onOpen, onSet, note, groups }) {
  const editing = !!onSet; // bars are always sliders: no Adjust switch
  return (
    <section className="panel">
      <div className="row-between">
        <p className="eyebrow">{title}</p>
      </div>
      {note && <p className="soft">{note}</p>}
      {skills.length === 0 ? <p className="soft">Nothing here yet.</p> : (
        <>
          <LevelScale />
          {groups ? groups.map((g) => {
            const mine = skills.filter((s) => s.axis === g.id);
            if (!mine.length) return null;
            return (
              <div key={g.id} className="skill-group">
                <p className="eyebrow">{g.name}</p>
                <ul className="skillbars">
                  {mine.map((s) => <SkillBar key={s.id} skill={s} check={checks[s.id]} level={level} editing={editing} onSet={onSet} onOpen={onOpen} />)}
                </ul>
              </div>
            );
          }) : (
            <ul className="skillbars">
              {skills.map((s) => <SkillBar key={s.id} skill={s} check={checks[s.id]} level={level} editing={editing} onSet={onSet} onOpen={onOpen} />)}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

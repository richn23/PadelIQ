import React, { useState } from 'react';
import { levels } from '../data.js';
import { levelName, quickQuestions, quickScore } from '../levels.js';

const CAN = [
  { id: 'always', label: 'Always' },
  { id: 'usually', label: 'Usually' },
  { id: 'sometimes', label: 'Sometimes' },
  { id: 'not_yet', label: 'Not yet' },
];
const WARN = [
  { id: 'often', label: 'Often' },
  { id: 'sometimes', label: 'Sometimes' },
  { id: 'rarely', label: 'Rarely' },
  { id: 'never', label: 'Never' },
];

const message = {
  solid_close: (l, next) => `Sounds like a solid ${l}, and close to ${next}.`,
  solid: (l) => `Sounds like a solid ${l}.`,
  not_solid: (l) => `${l}, but not solid yet.`,
  lower: (l, _n, lower) => `Your answers sound more like ${lower} for now.`,
};

// You say your level, then a few quick questions confirm it.
export default function QuickCheck({ skill, startLevel, onSave, onCancel, onDetail, onGoal }) {
  const [claim, setClaim] = useState(startLevel && startLevel !== 'Pro' ? startLevel : null);
  const [step, setStep] = useState('claim');
  const [ans, setAns] = useState({});
  const options = levels.filter((l) => l.assessable);
  const q = claim ? quickQuestions(skill, claim) : null;
  const items = q ? [...q.at.map((st) => ({ ...st, kind: 'can' })), ...(q.warning ? [{ ...q.warning, kind: 'warn' }] : []), ...(q.stretch ? [{ ...q.stretch, kind: 'can' }] : [])] : [];
  const nameLc = skill.name === skill.es ? skill.name : skill.name.toLowerCase();

  if (step === 'claim') {
    return (
      <div className="quick">
        <p className="insight">What level do you think your {nameLc} is?</p>
        <div className="level-pick">
          {options.map((l) => <button key={l.id} className={claim === l.id ? 'on' : ''} onClick={() => setClaim(l.id)}>{l.name}</button>)}
        </div>
        {claim && <p className="soft hint">{skill.levels[claim]?.text || levels.find((l) => l.id === claim)?.description}</p>}
        <button className="btn" disabled={!claim} onClick={() => setStep(items.length ? 'ask' : 'result')}>{items.length ? `Check it: ${items.length} quick question${items.length === 1 ? '' : 's'}` : 'Check it'}</button>
        <button className="btn ghost" disabled={!claim} onClick={() => onSave({ level: claim, claimed: claim, outcome: 'self', focus: [], answers: {}, mode: 'quick', setByYou: true })}>Skip, just set {claim ? levelName(claim) : 'it'}</button>
        <button className="ans skip" onClick={onCancel}>Cancel</button>
      </div>
    );
  }

  if (step === 'ask') {
    const done = items.every((it) => ans[it.id]);
    return (
      <div className="quick">
        <p className="soft">Checking {levelName(claim)}. How often?</p>
        <ul className="stmt-list">
          {items.map((it) => (
            <li key={it.id} className="stmt">
              <p className="stmt-text">{it.text}</p>
              <div className="seg4" role="radiogroup" aria-label={it.text}>
                {(it.kind === 'warn' ? WARN : CAN).map((o) => (
                  <button key={o.id} role="radio" aria-checked={ans[it.id] === o.id} className={ans[it.id] === o.id ? 'on' : ''} onClick={() => setAns({ ...ans, [it.id]: o.id })}>{o.label}</button>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <button className="btn" disabled={!done} onClick={() => setStep('result')}>See result</button>
        <button className="back center-self" onClick={() => setStep('claim')}>‹ Back</button>
      </div>
    );
  }

  const r = items.length ? quickScore(skill, claim, q, ans) : { outcome: 'solid', level: claim, focus: [] };
  const next = q?.stretch ? levelName(q.stretch.level) : '';
  const save = (level, setByYou) => onSave({ level, claimed: claim, outcome: r.outcome, focus: r.focus, answers: ans, mode: 'quick', setByYou });
  return (
    <div className="quick result-card">
      <p className="insight">{items.length ? message[r.outcome](levelName(claim), next, levelName(r.suggested)) : `${skill.name} isn't expected yet at ${levelName(claim)}.`}</p>
      {r.focus.length > 0 && (
        <div className="focus-point">
          <p className="eyebrow">Point to work on</p>
          <p className="focus-text">{r.focus[0]}</p>
          {onGoal && <button className="mini on" onClick={() => { save(r.outcome === 'lower' ? r.suggested : claim, false); onGoal(r.focus[0]); }}>Make this my goal</button>}
        </div>
      )}
      {r.outcome === 'lower' ? (
        <>
          <button className="btn" onClick={() => save(r.suggested, false)}>Switch to {levelName(r.suggested)}</button>
          <button className="btn ghost" onClick={() => save(claim, true)}>Keep {levelName(claim)}</button>
        </>
      ) : (
        <button className="btn" onClick={() => save(claim, false)}>Save</button>
      )}
      {onDetail && <button className="linkish center-self" onClick={onDetail}>Check in detail instead</button>}
    </div>
  );
}

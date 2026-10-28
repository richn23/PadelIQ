import React from 'react';
import { goalSkill } from '../goals.js';

const planOptions = [{ id: 'yes', label: 'Yes' }, { id: 'partly', label: 'Partly' }, { id: 'no', label: 'No' }];
const goalOptions = [{ id: 'better', label: 'Better' }, { id: 'same', label: 'Same' }, { id: 'struggling', label: 'Struggling' }];

// "Volley follow through, using continental grip, slice on serve" becomes three things to check, one by one.
export const splitPlan = (text) => String(text || '').split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean).slice(0, 4);

// One answer for old screens and the coach: all yes = yes, all no = no, anything else = partly.
export function planOverall(items) {
  const v = items.map((x) => x.check).filter(Boolean);
  if (!v.length) return '';
  if (v.every((x) => x === 'yes')) return 'yes';
  if (v.every((x) => x === 'no')) return 'no';
  return 'partly';
}

// Two sections: your goals (always, one question each) and what you planned for this game (one question each).
export default function FocusChecks({ session, goals, goalChecks, onGoal, planChecks, onPlan }) {
  const items = splitPlan(session.intention);
  if (!goals.length && !items.length) return null;
  const row = (key, title, note, options, value, onPick) => (
    <div key={key} className="check-row">
      <div className="check-text">
        <p className="goal-title">{title}</p>
        {note && <p className="goal-note">{note}</p>}
      </div>
      <div className="pills" role="group" aria-label={title}>
        {options.map((o) => <button key={o.id} type="button" className={value === o.id ? 'on' : ''} aria-pressed={value === o.id} onClick={() => onPick(value === o.id ? '' : o.id)}>{o.label}</button>)}
      </div>
    </div>
  );
  return (
    <section className="panel">
      <p className="eyebrow">Your focus</p>
      <p className="soft">Quick taps. Skip any you like.</p>
      {goals.length > 0 && <p className="sub">Goals</p>}
      {goals.map((g) => row(g.id, goalSkill(g), '', goalOptions, goalChecks[g.id], (v) => onGoal({ ...goalChecks, [g.id]: v })))}
      {items.length > 0 && <p className="sub">What you planned</p>}
      {items.map((t, i) => row('p' + i, t, '', planOptions, planChecks[i], (v) => onPlan({ ...planChecks, [i]: v })))}
    </section>
  );
}

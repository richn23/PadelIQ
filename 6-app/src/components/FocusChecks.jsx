import React from 'react';
import { goalSkill } from '../goals.js';

const planOptions = [{ id: 'yes', label: 'Yes', tone: 'good' }, { id: 'partly', label: 'Partly', tone: 'mid' }, { id: 'no', label: 'No', tone: 'low' }];
const goalOptions = [{ id: 'better', label: 'Better', tone: 'good' }, { id: 'same', label: 'Same', tone: 'mid' }, { id: 'struggling', label: 'Struggling', tone: 'low' }];

// "Volley follow through, using continental grip, slice on serve" becomes three things to check, one by one.
export const splitPlan = (text) => String(text || '').split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean).slice(0, 4).map((x) => x[0].toUpperCase() + x.slice(1));

// The extra things you planned (up to 2). Older games only have the one intention text, so split that.
export const planItems = (session) => (Array.isArray(session.extras) && session.extras.length ? session.extras.filter(Boolean) : splitPlan(session.intention));

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
  const items = planItems(session);
  if (!goals.length && !items.length) return null;
  const row = (key, title, note, options, value, onPick) => (
    <div key={key} className="check-row">
      <div className="check-text">
        <p className="goal-title">{title}</p>
        {note && <p className="goal-note">{note}</p>}
      </div>
      <div className="pills" role="group" aria-label={title}>
        {options.map((o) => <button key={o.id} type="button" className={value === o.id ? 'on ' + o.tone : ''} aria-pressed={value === o.id} onClick={() => onPick(value === o.id ? '' : o.id)}>{o.label}</button>)}
      </div>
    </div>
  );
  return (
    <section className="panel">
      <p className="eyebrow">Your focus</p>
      <p className="soft">Quick taps. Skip any you like.</p>
      {goals.length > 0 && <p className="sub">Goals</p>}
      {goals.map((g) => row(g.id, goalSkill(g), '', goalOptions, goalChecks[g.id], (v) => onGoal({ ...goalChecks, [g.id]: v })))}
      {items.length > 0 && <p className="sub">{goals.length ? 'Anything else you planned' : 'What you planned'}</p>}
      {items.map((t, i) => row('p' + i, t, '', planOptions, planChecks[i], (v) => onPlan({ ...planChecks, [i]: v })))}
    </section>
  );
}

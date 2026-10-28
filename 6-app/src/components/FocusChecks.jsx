import React from 'react';
import { goalSkill, goalNote } from '../goals.js';

const planOptions = [{ id: 'yes', label: 'Yes' }, { id: 'partly', label: 'Partly' }, { id: 'no', label: 'Not really' }];
const goalOptions = [{ id: 'better', label: 'Better' }, { id: 'same', label: 'About the same' }, { id: 'struggling', label: 'Still struggling' }];

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
  return (
    <>
      {goals.length > 0 && (
        <section className="panel">
          <p className="eyebrow">Your goals</p>
          <p className="soft">How did each one go in this game?</p>
          {goals.map((g) => (
            <div key={g.id} className="goal-check">
              <p className="goal-title">{goalSkill(g)}</p>
              {goalNote(g) && <p className="goal-note">{goalNote(g)}</p>}
              <div className="segmented small">
                {goalOptions.map((o) => <button key={o.id} className={goalChecks[g.id] === o.id ? 'on' : ''} onClick={() => onGoal({ ...goalChecks, [g.id]: o.id })}>{o.label}</button>)}
              </div>
            </div>
          ))}
        </section>
      )}
      {items.length > 0 && (
        <section className="panel">
          <p className="eyebrow">What you planned for this game</p>
          <p className="soft">From your pre-match notes. Did you manage each one?</p>
          {items.map((t, i) => (
            <div key={i} className="goal-check">
              <p className="goal-title">{t}</p>
              <div className="segmented small">
                {planOptions.map((o) => <button key={o.id} className={planChecks[i] === o.id ? 'on' : ''} onClick={() => onPlan({ ...planChecks, [i]: o.id })}>{o.label}</button>)}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

import React, { useState } from 'react';
import think from '../assets/mascot-think.png';

// What the coach offers depends on the screen you're on.
const prompts = {
  home: [
    { label: 'What should I focus on this week?', mode: 'deep_dive_goal' },
    { label: 'Get me ready for my next session', mode: 'pre_match' },
  ],
  skills: [
    { label: 'Help me with a weak spot', mode: 'deep_dive_goal' },
    { label: 'I get nervous on big points', mode: 'mindset' },
  ],
  goals: [
    { label: 'Talk through one of my goals', mode: 'deep_dive_goal' },
    { label: 'Get me ready for my next session', mode: 'pre_match' },
  ],
  matches: [
    { label: 'Help me reflect on my last session', mode: 'post_match' },
    { label: 'Get me ready for my next session', mode: 'pre_match' },
  ],
};

export default function CoachButton({ screen, onOpenCoach }) {
  const [open, setOpen] = useState(false);
  const list = prompts[screen] || prompts.home;
  return (
    <>
      <button className="coach-fab" onClick={() => setOpen(true)} aria-label="Ask the coach">
        <img src={think} alt="" />
      </button>
      {open && (
        <div className="sheet-backdrop" onClick={() => setOpen(false)}>
          <section className="sheet" onClick={(e) => e.stopPropagation()} aria-label="Ask the coach">
            <div className="mascot-row">
              <img className="mascot-img" src={think} alt="" />
              <div className="bubble">What would you like help with?</div>
            </div>
            <div className="ob-answers">
              {list.map((p) => (
                <button key={p.label} className="ans" onClick={() => { setOpen(false); onOpenCoach(p); }}>{p.label}</button>
              ))}
              <button className="ans" onClick={() => { setOpen(false); onOpenCoach({ mode: null }); }}>Something else</button>
            </div>
            <button className="btn ghost" onClick={() => setOpen(false)}>Close</button>
          </section>
        </div>
      )}
    </>
  );
}

import React, { useState } from 'react';
import think from '../assets/mascot-think.png';

// What the coach offers depends on the screen you're on (placeholder until the AI is connected).
const prompts = {
  home: ['What should I focus on this week?', 'Get me ready for my next session'],
  skills: ['Explain one of my weak spots', 'Which skill should I work on next?'],
  goals: ['Help me choose a goal', 'Is this goal realistic?'],
  matches: ['Help me reflect on my last match', 'Spot patterns in my matches'],
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
                <button key={p} className="ans" onClick={() => { setOpen(false); onOpenCoach(p); }}>{p}</button>
              ))}
            </div>
            <p className="soft center">The AI coach isn't connected yet. This shows where it will appear.</p>
            <button className="btn ghost" onClick={() => setOpen(false)}>Close</button>
          </section>
        </div>
      )}
    </>
  );
}

import React from 'react';
import think from '../assets/mascot-think.png';

const modes = [
  { name: 'Pre-match', what: 'Short and clear: 2 or 3 things to think about today.' },
  { name: 'Post-match', what: 'Asks questions to help you reflect. No advice.' },
  { name: 'Deep dive', what: 'Pick a weak spot. Explains it and suggests practice.' },
  { name: 'Mindset', what: 'Nerves, focus and bouncing back.' },
];

export default function Coach({ question }) {
  return (
    <main className="page">
      <div className="mascot-row">
        <img className="mascot-img" src={think} alt="" />
        <div className="bubble">{question ? `"${question}" I'll be able to answer that once I'm connected.` : 'How can I help today?'}</div>
      </div>
      <section className="panel">
        <p className="eyebrow">Coach modes</p>
        <ul className="list">
          {modes.map((m) => (
            <li key={m.name} className="list-row col">
              <strong>{m.name} <span className="tag">Coming soon</span></strong>
              <span className="soft">{m.what}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <p className="eyebrow">Inbox</p>
        <p className="soft">Tips and patterns from your notes will land here. Nothing yet.</p>
      </section>
    </main>
  );
}

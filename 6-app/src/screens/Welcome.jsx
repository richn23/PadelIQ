import React, { useState } from 'react';
import wave from '../assets/mascot-wave.png';
import { MODES } from '../modes.js';

// First screen: how do you want to use Padel IQ? You can change it any time in Settings.
export default function Welcome({ onPick }) {
  const [name, setName] = useState('');
  return (
    <main className="ob">
      <div className="mascot-row">
        <img className="mascot-img" src={wave} alt="" />
        <div className="bubble">Hi! I'm your Padel IQ coach. How would you like to use it?</div>
      </div>
      <div className="panel ob-form">
        <label className="soft">What should I call you? (optional)
          <input value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>
      <div className="ob-answers">
        {MODES.map((m) => (
          <button key={m.id} className="ans level-pick" onClick={() => onPick(m.id, name.trim())}>
            <strong>{m.name}{m.recommended ? ' · suggested' : ''}</strong>
            <span>{m.text}</span>
          </button>
        ))}
      </div>
      <p className="soft center ob-disc">You can change this any time in Settings. It's your own view, never a rating.</p>
    </main>
  );
}

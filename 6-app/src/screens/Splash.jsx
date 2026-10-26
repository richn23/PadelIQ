import React, { useEffect } from 'react';
import logo from '../assets/logo-chalk.png';

const SHOW_MS = 2200;

export default function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, SHOW_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <main className="splash">
      <svg className="splash-line" viewBox="0 0 400 800" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="chalk" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
          </filter>
        </defs>
        <path d="M140 820 L420 690" stroke="#fff" strokeWidth="16" strokeLinecap="round" filter="url(#chalk)" opacity="0.9" />
      </svg>

      <img className="splash-logo" src={logo} alt="Padel IQ" />
      <div className="splash-bar" role="progressbar" aria-label="Loading"><span /></div>
      <p className="splash-tag">Know your game<br />Improve with purpose</p>
    </main>
  );
}

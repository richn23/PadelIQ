import React from 'react';

// Four tabs. Home is reached by tapping the logo at the top of any screen.
const icons = {
  skills: <path d="M12 3l8.5 6.2-3.2 10H6.7L3.5 9.2z" />,
  goals: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.8" /></>,
  matches: <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />,
  coach: <path d="M4 5h16v11H9l-5 4z" />,
};

export const tabs = [
  { id: 'skills', label: 'Skills' },
  { id: 'goals', label: 'Goals' },
  { id: 'matches', label: 'Games' },
  { id: 'coach', label: 'Coach' },
];

// A little reflection keeps three tabs (no Skills). Just for fun has no tab bar at all.
export default function TabBar({ active, onChange, mode = 'full' }) {
  const shown = mode === 'reflect' ? tabs.filter((t) => t.id !== 'skills') : tabs;
  return (
    <nav className="tabbar" aria-label="Main">
      {shown.map((t) => (
        <button
          key={t.id}
          className={'tab' + (t.id === active ? ' active' : '')}
          aria-current={t.id === active ? 'page' : undefined}
          onClick={() => onChange(t.id)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {icons[t.id]}
          </svg>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

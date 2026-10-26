import React, { useMemo, useState } from 'react';

const OPTIONS = [
  { id: 'always', label: 'Always' },
  { id: 'usually', label: 'Usually' },
  { id: 'sometimes', label: 'Sometimes' },
  { id: 'not_yet', label: 'Not yet' },
];

// Mix the order (the same way every time for a skill), so the list doesn't read like a ladder.
function mixed(list, seed) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return [...list]
    .map((x, i) => ({ x, k: ((h ^ (i * 2654435761)) >>> 0) % 1000 }))
    .sort((a, b) => a.k - b.k)
    .map((o) => o.x);
}

export default function StatementCheck({ skill, initial = {}, onSave, saveLabel = 'Save', onSkip, skipLabel = 'Not sure', intro = true }) {
  const [answers, setAnswers] = useState(initial);
  const list = useMemo(() => mixed(skill.statements || [], skill.id), [skill]);
  const answered = Object.keys(answers).length;

  return (
    <div className="stmt-check">
      {intro && <p className="soft">How often is each of these true for you? Answer what you can.</p>}
      <ul className="stmt-list">
        {list.map((st) => (
          <li key={st.id} className="stmt">
            <p className="stmt-text">{st.text}</p>
            <div className="seg4" role="radiogroup" aria-label={st.text}>
              {OPTIONS.map((o) => (
                <button key={o.id} role="radio" aria-checked={answers[st.id] === o.id} className={answers[st.id] === o.id ? 'on' : ''} onClick={() => setAnswers({ ...answers, [st.id]: o.id })}>{o.label}</button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <button className="btn" disabled={!answered} onClick={() => onSave(answers)}>{saveLabel}</button>
      {onSkip && <button className="ans skip" onClick={onSkip}>{skipLabel}</button>}
    </div>
  );
}

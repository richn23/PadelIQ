import React, { useState } from 'react';
import { levels, axisById } from '../data.js';
import { skillChecks, levelName, notYetLevel } from '../levels.js';
import { pickCheckInSkills } from '../checkin.js';
import think from '../assets/mascot-think.png';
import cheer from '../assets/mascot-cheer.png';

export default function CheckIn({ player, updatePlayer, onDone }) {
  const [list] = useState(() => pickCheckInSkills(player));
  const [i, setI] = useState(-1);
  const [answers, setAnswers] = useState({});
  const before = skillChecks(player);

  if (i === -1) {
    return (
      <main className="page">
        <div className="mascot-row"><img className="mascot-img" src={think} alt="" /><div className="bubble">Check-in time. {list.length} quick skills, about 2 per area. Your goals come first.</div></div>
        <p className="soft center">You'll see your last answer each time. Nothing changes until you approve it at the end.</p>
        <button className="btn" onClick={() => setI(0)}>Start</button>
        <button className="btn ghost" onClick={onDone}>Not now</button>
      </main>
    );
  }

  if (i < list.length) {
    const s = list[i];
    const prev = before[s.id];
    const pick = (lv) => { setAnswers({ ...answers, [s.id]: lv }); setI(i + 1); };
    return (
      <main className="page">
        <div className="bar ob-bar"><span style={{ width: `${(i / list.length) * 100}%` }} /></div>
        <p className="eyebrow center">{axisById[s.axis].name} · {i + 1} of {list.length}</p>
        <div className="mascot-row"><img className="mascot-img" src={think} alt="" /><div className="bubble">{s.name}: which sounds most like you now?</div></div>
        {prev && <p className="soft center">Last time: {levelName(prev.level)}{prev.from === 'quiz' ? ' (from the quiz)' : ''}</p>}
        <div className="ob-answers">
          {levels.filter((l) => s.levels[l.id]).map((l) => (
            <button key={l.id} className={'ans' + (prev?.level === l.id ? ' picked' : '')} onClick={() => pick(l.id)}>
              <strong>{l.name}.</strong> {s.levels[l.id].text}
            </button>
          ))}
          <button className="ans" onClick={() => pick(notYetLevel(s))}><strong>Not yet.</strong> I can't really do this yet.</button>
          <button className="ans skip" onClick={() => setI(i + 1)}>Skip this one</button>
          {i > 0 && <button className="back center-self" onClick={() => setI(i - 1)}>‹ Back</button>}
        </div>
      </main>
    );
  }

  const changes = list.filter((s) => answers[s.id]);
  const approve = () => {
    const now = new Date().toISOString();
    updatePlayer((p) => {
      const sc = { ...(p.skillChecks || {}) };
      changes.forEach((s) => { sc[s.id] = { level: answers[s.id], date: now }; });
      return { ...p, skillChecks: sc, provisional: false, lastCheckIn: now, checkIns: [...(p.checkIns || []), { date: now, answers }] };
    });
    onDone();
  };
  return (
    <main className="page">
      <div className="mascot-row"><img className="mascot-img" src={cheer} alt="" /><div className="bubble">Done. Here's what changes. Happy with it?</div></div>
      <section className="panel">
        <ul className="list">
          {changes.length === 0 && <li className="list-row"><span className="soft">You skipped everything. Nothing changes.</span></li>}
          {changes.map((s) => {
            const was = before[s.id]?.level;
            return (
              <li key={s.id} className="list-row">
                <span>{s.name}</span>
                {was === answers[s.id]
                  ? <span className="soft">{levelName(was)} · no change</span>
                  : <span className="soft">{was ? levelName(was) : '–'} → <strong className="goal-pct">{levelName(answers[s.id])}</strong></span>}
              </li>
            );
          })}
        </ul>
      </section>
      <button className="btn" onClick={approve}>Approve and save</button>
      <button className="btn ghost" onClick={() => { setAnswers({}); setI(0); }}>Redo</button>
    </main>
  );
}

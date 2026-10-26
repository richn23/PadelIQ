import React, { useState } from 'react';
import { levels, axisById, allSkillById } from '../data.js';
import { skillChecks, levelName, currentAxisLevels } from '../levels.js';
import QuickCheck from '../components/QuickCheck.jsx';
import { buildCheckInList, reviewSummary } from '../checkin.js';
import { SkillChips } from './Matches.jsx';
import { goalLine } from '../goals.js';
import think from '../assets/mascot-think.png';
import cheer from '../assets/mascot-cheer.png';

export default function CheckIn({ player, updatePlayer, onDone }) {
  const [step, setStep] = useState('review'); // review -> working -> notWorking -> questions
  const [working, setWorking] = useState([]);
  const [notWorking, setNotWorking] = useState([]);
  const [note, setNote] = useState('');
  const [list, setList] = useState([]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const before = skillChecks(player);
  const sum = reviewSummary(player);
  const goals = player.goals || [];
  const prefer = [...new Set([...sum.topTags.map((t) => t.id), ...goals.map((g) => g.skillId)])];

  if (step === 'review') {
    const r = sum.results;
    return (
      <main className="page">
        <div className="mascot-row"><img className="mascot-img" src={think} alt="" /><div className="bubble">Check-in time. Let's look back at your last {sum.list.length || 5} sessions first.</div></div>
        <section className="panel">
          <p className="eyebrow">Your last {sum.list.length} sessions</p>
          {sum.list.length === 0 ? <p className="soft">No sessions logged yet. That's fine, we'll go on what you tell me.</p> : (
            <ul className="list">
              <li className="list-row"><span>Played</span><span className="soft">{sum.matches} match{sum.matches === 1 ? '' : 'es'}, {sum.lessons} lesson{sum.lessons === 1 ? '' : 's'}</span></li>
              {sum.matches > 0 && <li className="list-row"><span>Results</span><span className="soft">{r.won} won, {r.lost} lost{r.draw ? `, ${r.draw} drawn` : ''}</span></li>}
              {(sum.intentions.yes + sum.intentions.partly + sum.intentions.no) > 0 && <li className="list-row"><span>Intentions</span><span className="soft">{sum.intentions.yes} managed, {sum.intentions.partly} partly, {sum.intentions.no} not really</span></li>}
              {goals.filter((g) => sum.goalChecks[g.id]).map((g) => {
                const c = sum.goalChecks[g.id];
                return <li key={g.id} className="list-row col"><span>{goalLine(g)}</span><span className="soft">Better {c.better} · Same {c.same} · Still struggling {c.struggling}</span></li>;
              })}
              {sum.topTags.length > 0 && <li className="list-row col"><span>Came up most</span><span className="soft">{sum.topTags.slice(0, 4).map((t) => `${allSkillById[t.id]?.name} (${t.count})`).join(', ')}</span></li>}
            </ul>
          )}
        </section>
        <button className="btn" onClick={() => setStep('working')}>Start</button>
        <button className="btn ghost" onClick={onDone}>Not now</button>
      </main>
    );
  }

  if (step === 'working' || step === 'notWorking') {
    const isW = step === 'working';
    return (
      <main className="page">
        <div className="ob-top">
          <button className="back" onClick={() => setStep(isW ? 'review' : 'working')}>‹ Back</button>
          <div className="bar ob-bar"><span style={{ width: isW ? '10%' : '20%' }} /></div>
        </div>
        <div className="mascot-row"><img className="mascot-img" src={think} alt="" /><div className="bubble">{isW ? "What's working well at the moment?" : "And what isn't working?"}</div></div>
        <section className="panel">
          <p className="soft">Tap any skills. Suggested ones come from your last sessions and goals.</p>
          <SkillChips selected={isW ? working : notWorking} onChange={isW ? setWorking : setNotWorking} prefer={prefer} />
        </section>
        {!isW && (
          <section className="panel ob-form">
            <label className="soft">Anything else? (optional)<textarea rows="2" value={note} onChange={(e) => setNote(e.target.value)} /></label>
          </section>
        )}
        <button className="btn" onClick={() => {
          if (isW) { setStep('notWorking'); return; }
          setList(buildCheckInList(player, working, notWorking));
          setI(0);
          setStep('questions');
        }}>{isW ? 'Next' : 'Next: check those skills'}</button>
      </main>
    );
  }

  if (i < list.length) {
    const s = list[i];
    const prev = before[s.id];
    const save = (rec) => { setAnswers({ ...answers, [s.id]: rec }); setI(i + 1); };
    return (
      <main className="page">
        <div className="ob-top">
          <button className="back" onClick={() => (i > 0 ? setI(i - 1) : setStep('notWorking'))}>‹ Back</button>
          <div className="bar ob-bar"><span style={{ width: `${20 + (i / list.length) * 80}%` }} /></div>
        </div>
        <p className="eyebrow center">{axisById[s.axis].name} · {i + 1} of {list.length}</p>
        <div className="mascot-row"><img className="mascot-img small" src={think} alt="" /><div className="bubble">{s.name}: where are you now?</div></div>
        {(notWorking.includes(s.id) || working.includes(s.id) || prev?.answers) && (
          <p className="soft center">
            {notWorking.includes(s.id) ? "You said this isn't working. " : working.includes(s.id) ? 'You said this is working. ' : ''}
            {prev ? `Last time: ${levelName(prev.level)}.` : ''}
          </p>
        )}
        <section className="panel">
          <QuickCheck key={s.id} skill={s} startLevel={answers[s.id]?.claimed || prev?.level || currentAxisLevels(player)[s.axis]} onSave={save} onCancel={() => setI(i + 1)} />
          <button className="ans skip" onClick={() => setI(i + 1)}>Skip this skill</button>
        </section>
      </main>
    );
  }

  const changes = list.filter((s) => answers[s.id]);
  const lv = (id) => answers[id]?.level;
  const approve = () => {
    const now = new Date().toISOString();
    updatePlayer((p) => {
      const sc = { ...(p.skillChecks || {}) };
      changes.forEach((s) => { sc[s.id] = { ...answers[s.id], date: now }; });
      return { ...p, skillChecks: sc, provisional: false, lastCheckIn: now, checkIns: [...(p.checkIns || []), { date: now, levels: Object.fromEntries(changes.map((s) => [s.id, lv(s.id)])), working, notWorking, note: note.trim() }] };
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
                {was === lv(s.id)
                  ? <span className="soft">{levelName(was)} · no change</span>
                  : <span className="soft">{was ? levelName(was) : '–'} → <strong className="goal-pct">{levelName(lv(s.id))}</strong></span>}
              </li>
            );
          })}
        </ul>
      </section>
      <button className="btn" onClick={approve}>Approve and save</button>
      <button className="btn ghost" onClick={() => { setAnswers({}); setI(0); setStep('working'); }}>Redo</button>
    </main>
  );
}

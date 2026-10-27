import React, { useEffect, useMemo, useState } from 'react';
import Pentagon from '../components/Pentagon.jsx';
import { axes, levels, allSkills, onboarding as ob } from '../data.js';
import { levelOrder, levelByOrder, levelName, overallLevel, areaScores } from '../levels.js';
import { Checklist, rowsAt, key, earlierLevels, answerFor, quizChecks, passOf, isKey } from '../components/LevelChecklist.jsx';
import wave from '../assets/mascot-wave.png';
import think from '../assets/mascot-think.png';
import cheer from '../assets/mascot-cheer.png';

// Flow: 0 name + how often, 1 pick your level, 2 checklist, 3 result.
// The checklist asks about your level only, one area at a time. Earlier levels are
// collapsed and ticked for you, with a score, and can be opened and changed.
// The result never moves more than one step from the level you picked.

const say = (line, vars) => line.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const TOP = levelOrder('A');
const lowerOf = (id) => levelByOrder(Math.max(levelOrder(id) - 1, 0)).id;
const upperOf = (id) => levelByOrder(Math.min(levelOrder(id) + 1, TOP)).id;

// Areas: pass at least half of your level's skills in that area (plus anything earlier you changed).
function areasFor(levelId, ans, pick, failLevel = lowerOf(levelId)) {
  const out = {};
  axes.forEach((a) => {
    const pool = [];
    rowsAt(levelId, pick).filter((s) => s.axis === a.id).forEach((s) => pool.push(answerFor(s, levelId, ans, levelId)));
    earlierLevels(levelId, pick).forEach((l) => rowsAt(l.id, pick).filter((s) => s.axis === a.id && ans[key(s, l.id)]).forEach((s) => pool.push(ans[key(s, l.id)])));
    const passed = pool.filter(passOf).length;
    out[a.id] = !pool.length || passed / pool.length >= 0.5 ? levelId : failLevel;
  });
  return out;
}

function Mascot({ pose, children }) {
  const img = { wave, think, cheer }[pose];
  return (
    <div className="mascot-row">
      <img className="mascot-img" src={img} alt="" />
      <div className="bubble">{children}</div>
    </div>
  );
}

export default function Onboarding({ onDone, onCancel, initialName = '' }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initialName);
  const [often, setOften] = useState(null);
  const [picked, setPicked] = useState(null); // what the player said (can be Pro)
  const [base, setBase] = useState(null); // level checked (Pro is checked as A)
  const [answers, setAnswers] = useState({});
  const [up, setUp] = useState(null); // { level } when checking the level above
  const [len, setLen] = useState(null); // 'short' (key skills) or 'full'
  const pick = len === 'short' ? isKey : () => true;

  useEffect(() => { window.scrollTo(0, 0); }, [step, up?.level, len]);

  const checking = up ? up.level : base;
  const mineDone = useMemo(() => (checking ? rowsAt(checking, pick).every((s) => answers[key(s, checking)]) : false), [checking, answers, len]);

  const finish = (level, axisLevels, levelUsed, setByPlayer = false) =>
    onDone({ name: name.trim(), about: { often }, extra: {}, answers: {}, quizChecks: quizChecks(levelUsed, answers, pick), quiz: { level: levelUsed, length: len || 'full' }, axisLevels, level, setByPlayer });

  const Top = ({ back }) => (
    <div className="ob-top">
      <button className="back" onClick={back} aria-label="Back">‹ Back</button>
      <div className="bar ob-bar"><span style={{ width: `${(step / 3) * 100}%` }} /></div>
    </div>
  );

  // 0. Name and how often
  if (step === 0) {
    return (
      <main className="ob">
        <Mascot pose="wave">{ob.lines.welcome}</Mascot>
        <div className="panel ob-form">
          <label className="soft">{ob.lines.name}
            <input value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <p className="eyebrow">{ob.lines.often}</p>
        <div className="ob-answers">
          {ob.playsPerWeek.map((o) => (
            <button key={o} className={`ans${often === o ? ' picked' : ''}`} onClick={() => { setOften(o); setStep(1); }}>{o}</button>
          ))}
        </div>
        <p className="soft center ob-disc">{ob.disclaimer}</p>
        {onCancel && <button className="btn ghost" onClick={onCancel}>Cancel, keep my current answers</button>}
      </main>
    );
  }

  // 1. Pick your level
  if (step === 1) {
    return (
      <main className="ob">
        <Top back={() => setStep(0)} />
        <Mascot pose="think">{ob.lines.level}</Mascot>
        <div className="ob-answers">
          {ob.levelChoices.map((c) => (
            <button
              key={c.id}
              className={`ans level-pick${picked === c.id ? ' picked' : ''}`}
              onClick={() => { const b = c.id === 'Pro' ? 'A' : c.id; setPicked(c.id); setBase(b); setUp(null); setLen(rowsAt(b).length <= 8 ? 'full' : null); setStep(2); }}
            >
              <strong>{levelName(c.id)}</strong>
              <span>{c.text}</span>
            </button>
          ))}
        </div>
        <p className="soft center ob-disc">{ob.levelNote}</p>
      </main>
    );
  }

  // 2a. Quick or full check
  if (step === 2 && !len) {
    const all = rowsAt(base).length;
    const few = rowsAt(base, isKey).length;
    return (
      <main className="ob">
        <Top back={() => setStep(1)} />
        <Mascot pose="think">{ob.lines.length}</Mascot>
        <div className="ob-answers">
          <button className="ans level-pick" onClick={() => setLen('short')}>
            <strong>Quick check</strong>
            <span>{few} questions, about a minute. The most important skills. You can check the rest later in Skills.</span>
          </button>
          <button className="ans level-pick" onClick={() => setLen('full')}>
            <strong>Full check</strong>
            <span>{all} questions, about {Math.max(2, Math.round(all / 10))} minutes. Every {levelName(base)} skill, so your profile is complete.</span>
          </button>
        </div>
      </main>
    );
  }

  // 2b. Checklist
  if (step === 2) {
    return (
      <main className="ob">
        <Top back={() => (up ? (setUp(null), setStep(3)) : rowsAt(base).length <= 8 ? setStep(1) : setLen(null))} />
        <Mascot pose="think">{say(levelOrder(checking) === 0 ? ob.lines.checksBeginner : ob.lines.checks, { level: levelName(checking) })}</Mascot>
        {levelOrder(checking) > 0 && <p className="soft small">{ob.lines.checksNote}</p>}
        <Checklist key={checking + len} levelId={checking} ans={answers} setAns={setAnswers} pick={pick} />
        <button className="btn" disabled={!mineDone} onClick={() => setStep(3)}>{mineDone ? 'See my level' : `Answer all the ${levelName(checking)} skills to continue`}</button>
      </main>
    );
  }

  // 3. Result. The level is where most of your areas sit (the same rule the app uses later).
  let level, axisLevels, line, buttons;
  // Your level holds if you pass at least half of its skills AND most areas sit at it.
  const share = (lv) => { const l = rowsAt(lv, pick); return l.length ? l.filter((s) => passOf(answers[key(s, lv)])).length / l.length : 1; };
  const holds = (lv, areas) => share(lv) >= 0.5 && overallLevel(areas) === lv;
  const baseAreas = areasFor(base, answers, pick);

  if (up) {
    const upAreas = areasFor(up.level, answers, pick, base);
    if (holds(up.level, upAreas)) {
      level = up.level; axisLevels = upAreas;
      line = say(share(up.level) === 1 ? ob.lines.resultPass : ob.lines.resultMixed, { level: levelName(level) });
    } else {
      level = base; axisLevels = baseAreas;
      line = say(ob.lines.upFailed, { up: levelName(up.level), level: levelName(base) });
    }
    buttons = <button className="btn" onClick={() => finish(level, axisLevels, level)}>Yes, that feels right</button>;
  } else if (holds(base, baseAreas)) {
    level = base; axisLevels = baseAreas;
    const allYes = rowsAt(base, pick).every((s) => answers[key(s, base)] === 'yes');
    const canGoUp = allYes && levelOrder(base) < TOP;
    const allPass = share(base) === 1;
    line = say(canGoUp ? ob.lines.resultAllYes : allPass ? ob.lines.resultPass : ob.lines.resultMixed, { level: levelName(level) });
    buttons = (
      <>
        <button className="btn" onClick={() => finish(level, axisLevels, level)}>Yes, that feels right</button>
        {canGoUp && <button className="btn ghost" onClick={() => { setUp({ level: upperOf(base) }); setStep(2); }}>Check {levelName(upperOf(base))}</button>}
      </>
    );
  } else if (base === 'beginner') {
    level = 'beginner';
    axisLevels = Object.fromEntries(axes.map((a) => [a.id, 'beginner']));
    line = ob.lines.resultLowest;
    buttons = <button className="btn" onClick={() => finish(level, axisLevels, level)}>Let's go</button>;
  } else {
    const lower = lowerOf(base);
    level = lower; axisLevels = Object.fromEntries(axes.map((a) => [a.id, lower]));
    line = say(ob.lines.resultLower, { level: levelName(base), lower: levelName(lower) });
    buttons = (
      <>
        <button className="btn" onClick={() => finish(lower, axisLevels, lower)}>Use {levelName(lower)}</button>
        <button className="btn ghost" onClick={() => finish(base, baseAreas, base, true)}>Keep {levelName(base)}</button>
      </>
    );
  }

  // The jagged picture: each area gets a + or − from the answers behind it.
  const previewScores = areaScores(quizChecks(level, answers, pick), level, axisLevels);

  return (
    <main className="ob">
      <Mascot pose="cheer">{line}</Mascot>
      <section className="panel center ob-result">
        <div className="ob-level">
          <p className="eyebrow">Your starting level</p>
          <p className="ob-level-value">{levelName(level)}</p>
        </div>
        <p className="soft">It gets more accurate after your first check-in (after 5 sessions).</p>
        <Pentagon axes={axes} axisLevels={axisLevels} scores={previewScores} selected={null} onSelect={() => {}} />
        <p className="soft small">+ means strong at this level, − means still working on it.</p>
      </section>
      <div className="ob-actions">
        {buttons}
        <button className="ans skip" onClick={() => { setUp(null); setStep(2); }}>Change my answers</button>
        <button className="ans skip" onClick={() => { setUp(null); setStep(1); }}>Pick a different level</button>
      </div>
    </main>
  );
}

import React, { useState } from 'react';
import Pentagon from '../components/Pentagon.jsx';
import { axes, levels, onboarding as ob } from '../data.js';
import { levelOrder, overallLevel } from '../levels.js';
import wave from '../assets/mascot-wave.png';
import think from '../assets/mascot-think.png';
import cheer from '../assets/mascot-cheer.png';

const ABOUT = [
  { key: 'years', ask: ob.lines.years, options: ob.yearsPlaying },
  { key: 'often', ask: ob.lines.often, options: ob.playsPerWeek },
];

// Two answers per area: take the average, rounded to the nearest level (a weak spot
// pulls you down a little, but doesn't sink you).
function workOutLevels(answers) {
  const result = {};
  axes.forEach((a) => {
    const picks = ob.questions
      .filter((q) => q.axis === a.id && typeof answers[q.id] === 'number')
      .map((q) => answers[q.id]);
    const avg = picks.length ? picks.reduce((x, y) => x + y, 0) / picks.length : 1;
    const idx = Math.min(Math.floor(avg + 0.5), ob.answerLevels.length - 2); // a self-rating never gives Pro
    result[a.id] = ob.answerLevels[idx];
  });
  return result;
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

export default function Onboarding({ onDone }) {
  // steps: 0 welcome, 1-2 about you, 3 playtomic/club, 4..13 questions, 14 result, 15 pick level
  const total = ABOUT.length + 1 + ob.questions.length;
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [about, setAbout] = useState({});
  const [extra, setExtra] = useState({ playtomic: '', club: '' });
  const [answers, setAnswers] = useState({});
  const [chosen, setChosen] = useState(null); // level picked by the player

  const next = () => setStep((s) => s + 1);
  const progress = Math.min(step, total) / total;
  const Progress = () => <div className="bar ob-bar"><span style={{ width: `${progress * 100}%` }} /></div>;

  if (step === 0) {
    return (
      <main className="ob">
        <Mascot pose="wave">{ob.lines.welcome}</Mascot>
        <div className="panel ob-form">
          <label className="soft">{ob.lines.name}
            <input value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <p className="soft center ob-disc">{ob.disclaimer}</p>
        <button className="btn" onClick={next}>{ob.lines.go}</button>
      </main>
    );
  }

  if (step <= ABOUT.length) {
    const q = ABOUT[step - 1];
    return (
      <main className="ob">
        <Progress />
        <Mascot pose="think">{q.ask}</Mascot>
        <div className="ob-answers">
          {q.options.map((o) => (
            <button key={o} className="ans" onClick={() => { setAbout({ ...about, [q.key]: o }); next(); }}>{o}</button>
          ))}
          <button className="ans skip" onClick={next}>Skip</button>
        </div>
      </main>
    );
  }

  if (step === ABOUT.length + 1) {
    return (
      <main className="ob">
        <Progress />
        <Mascot pose="think">{ob.lines.hint}</Mascot>
        <div className="panel ob-form">
          <label className="soft">{ob.lines.playtomic}
            <input inputMode="decimal" value={extra.playtomic} onChange={(e) => setExtra({ ...extra, playtomic: e.target.value })} />
          </label>
          <label className="soft">{ob.lines.club}
            <input value={extra.club} onChange={(e) => setExtra({ ...extra, club: e.target.value })} />
          </label>
        </div>
        <button className="btn" onClick={next}>Next</button>
      </main>
    );
  }

  const qIndex = step - (ABOUT.length + 2);
  if (qIndex < ob.questions.length) {
    const q = ob.questions[qIndex];
    const axis = axes.find((a) => a.id === q.axis);
    return (
      <main className="ob">
        <Progress />
        <p className="eyebrow center">{axis.name} · {qIndex + 1} of {ob.questions.length}</p>
        <Mascot pose="think">{q.ask}</Mascot>
        <div className="ob-answers">
          {q.answers.map((t, i) => (
            <button key={t} className="ans" onClick={() => { setAnswers({ ...answers, [q.id]: i }); next(); }}>{t}</button>
          ))}
          <button className="ans skip" onClick={() => { setAnswers({ ...answers, [q.id]: 'unsure' }); next(); }}>Not sure</button>
        </div>
      </main>
    );
  }

  const axisLevels = workOutLevels(answers);
  const level = chosen || overallLevel(axisLevels);
  const resultStep = ABOUT.length + 2 + ob.questions.length;

  if (step === resultStep) {
    return (
      <main className="ob">
        <Mascot pose="cheer">{ob.lines.result}</Mascot>
        <section className="panel center ob-result">
          <div className="ob-level">
            <p className="eyebrow">Your starting level</p>
            <p className="ob-level-value">{levels.find((l) => l.id === level)?.name}</p>
          </div>
          <p className="soft">It gets more accurate after your first check-in, in 5 sessions.</p>
          <Pentagon axes={axes} axisLevels={axisLevels} selected={null} onSelect={() => {}} />
        </section>
        <p className="soft center ob-disc">{ob.levelNote}</p>
        <div className="ob-actions">
          <button className="btn" onClick={() => onDone({ name: name.trim(), about, extra, answers, axisLevels, level, setByPlayer: !!chosen })}>Yes, that feels right</button>
          <button className="btn ghost" onClick={next}>Not quite, let me choose</button>
        </div>
      </main>
    );
  }

  // pick your own level
  return (
    <main className="ob">
      <Mascot pose="think">{ob.lines.pick}</Mascot>
      <div className="ob-answers">
        {levels.filter((l) => l.id !== 'Pro').map((l) => (
          <button key={l.id} className="ans" onClick={() => { setChosen(l.id); setStep(resultStep); }}>{l.name}</button>
        ))}
      </div>
    </main>
  );
}

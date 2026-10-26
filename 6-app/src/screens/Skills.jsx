import React, { useState } from 'react';
import Pentagon from '../components/Pentagon.jsx';
import { axes, levels, groups, allSkills, allSkillById, axisById } from '../data.js';
import { levelOrder, levelName, levelByOrder, skillChecks, currentAxisLevels, currentLevel, requiredFor } from '../levels.js';

const views = [
  { id: 'have', label: 'My skills' },
  { id: 'next', label: 'Work on next' },
  { id: 'explore', label: 'Explore' },
];

export default function Skills({ player, updatePlayer }) {
  const [view, setView] = useState('have');
  const [open, setOpen] = useState(null);
  const checks = skillChecks(player);
  const axisLevels = currentAxisLevels(player);
  const level = currentLevel(player);

  if (open) {
    return <SkillPage skill={allSkillById[open]} check={checks[open]} player={player} updatePlayer={updatePlayer} onBack={() => setOpen(null)} />;
  }

  return (
    <main className="page">
      <div className="segmented" role="tablist">
        {views.map((v) => (
          <button key={v.id} role="tab" aria-selected={view === v.id} className={view === v.id ? 'on' : ''} onClick={() => setView(v.id)}>{v.label}</button>
        ))}
      </div>
      {view === 'have' && <Have axisLevels={axisLevels} level={level} checks={checks} onOpen={setOpen} />}
      {view === 'next' && <Next level={level} checks={checks} onOpen={setOpen} />}
      {view === 'explore' && <Explore onOpen={setOpen} />}
    </main>
  );
}

function Row({ skill, right, onOpen }) {
  return (
    <li>
      <button className="list-row link" onClick={() => onOpen(skill.id)}>
        <span>{skill.name}</span>
        <span className="row-right">{right}<span className="chev" aria-hidden="true">›</span></span>
      </button>
    </li>
  );
}

function Have({ axisLevels, level, checks, onOpen }) {
  const [area, setArea] = useState(null);
  const checked = allSkills.filter((s) => checks[s.id] && (!area || s.axis === area));
  const strengths = allSkills.filter((s) => checks[s.id] && levelOrder(checks[s.id].level) > levelOrder(level));
  return (
    <>
      <section className="panel">
        <div className="row-between"><p className="eyebrow">Your level</p><p className="pill">{levelName(level)}</p></div>
        <Pentagon axes={axes} axisLevels={axisLevels} selected={area} onSelect={(id) => setArea(area === id ? null : id)} />
        <p className="soft center">{area ? `Showing ${axisById[area].name}. Tap again for all.` : 'Tap an area to filter'}</p>
      </section>
      {strengths.length > 0 && !area && (
        <section className="panel">
          <p className="eyebrow">Ahead of your level</p>
          <ul className="list">{strengths.map((s) => <Row key={s.id} skill={s} onOpen={onOpen} right={<span className="pill">{levelName(checks[s.id].level)}</span>} />)}</ul>
        </section>
      )}
      <section className="panel">
        <p className="eyebrow">{area ? axisById[area].name : 'Skills you have checked'}</p>
        {checked.length === 0 ? (
          <p className="soft">Nothing checked here yet. Open a skill in Explore or Work on next and tap "Check myself".</p>
        ) : (
          <ul className="list">
            {checked.map((s) => (
              <Row key={s.id} skill={s} onOpen={onOpen} right={<><span className="soft">{checks[s.id].from === 'quiz' ? 'from quiz' : ''}</span><span className="pill">{levelName(checks[s.id].level)}</span></>} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Next({ level, checks, onOpen }) {
  const now = levelOrder(level);
  const nextLevel = levelByOrder(Math.min(now + 1, 4)); // A is the top checked level
  const rows = allSkills
    .filter((s) => s.checked)
    .map((s) => {
      const need = requiredFor(s, nextLevel.id);
      const have = checks[s.id] ? levelOrder(checks[s.id].level) : null;
      return { s, need, have };
    })
    .filter((r) => r.need !== null && (r.have === null || r.have < r.need));
  const gaps = rows.filter((r) => r.need <= now);
  const ahead = rows.filter((r) => r.need > now);
  const right = (r) => (r.have === null ? <span className="tag">Not checked</span> : <span className="soft">{levelName(levelByOrder(r.have).id)} → {levelName(levelByOrder(r.need).id)}</span>);
  return (
    <>
      <section className="panel">
        <p className="eyebrow">Gaps at your level ({levelName(level)})</p>
        <p className="soft">Skills a {levelName(level)} player usually has. Closing these makes your level solid.</p>
        {gaps.length ? <ul className="list">{gaps.map((r) => <Row key={r.s.id} skill={r.s} onOpen={onOpen} right={right(r)} />)}</ul> : <p className="insight">No gaps. Nice.</p>}
      </section>
      <section className="panel">
        <p className="eyebrow">Towards {levelName(nextLevel.id)}</p>
        <p className="soft">What the next level asks for.</p>
        {ahead.length ? <ul className="list">{ahead.map((r) => <Row key={r.s.id} skill={r.s} onOpen={onOpen} right={right(r)} />)}</ul> : <p className="soft">Nothing listed yet.</p>}
      </section>
    </>
  );
}

function Explore({ onOpen }) {
  const [q, setQ] = useState('');
  // Ignore accents, so "vibora" finds "Víbora"
  const plain = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const term = plain(q.trim());
  const match = (s) => !term || plain([s.name, s.aka, s.what].join(' ')).includes(term);
  const none = term && !allSkills.some(match);
  return (
    <>
      <input className="search" placeholder="Search shots and skills (e.g. víbora)" value={q} onChange={(e) => setQ(e.target.value)} />
      {none && <p className="soft center">Nothing matches "{q}" yet.</p>}
      {groups.map((g) => {
        const items = allSkills.filter((s) => s.group === g.id && match(s));
        if (!items.length) return null;
        return (
          <section className="panel" key={g.id}>
            <p className="eyebrow">{g.name}</p>
            {g.note && <p className="soft">{g.note}</p>}
            <ul className="list">
              {items.map((s) => <Row key={s.id} skill={s} onOpen={onOpen} right={<span className="soft">{s.aka}</span>} />)}
            </ul>
          </section>
        );
      })}
    </>
  );
}

// A concrete example goal, to show what "specific" looks like.
function goalIdea(skill) {
  const ideas = {
    serve: 'Serve deep to the backhand', volley: 'Keep my volleys low and deep', bandeja: 'Bandeja cross-court, not to the middle',
    net_play: 'Follow my lobs to the net', back_glass_return: 'Wait for the ball off the back glass', chiquita: 'Play one chiquita each game',
    composure: 'Same routine on big points', defensive_lob: 'Lob high and deep, not short',
  };
  return ideas[skill.id] || `Use my ${skill.name.toLowerCase()} more in matches`;
}

function SkillPage({ skill, check, player, updatePlayer, onBack }) {
  const [checking, setChecking] = useState(false);
  const [note, setNote] = useState('');
  const [goalForm, setGoalForm] = useState(null); // { title, progress }
  const described = levels.filter((l) => skill.levels[l.id]);
  const goals = player.goals || [];
  const isGoal = goals.some((g) => g.skillId === skill.id);

  const saveCheck = (levelId) => {
    updatePlayer((p) => ({ ...p, skillChecks: { ...(p.skillChecks || {}), [skill.id]: { level: levelId, date: new Date().toISOString() } } }));
    setChecking(false);
    setNote('Saved.');
  };
  const makeGoal = () => {
    if (isGoal) return;
    if (goals.length >= 3) { setNote('You already have 3 goals. Finish or remove one first.'); return; }
    setGoalForm({ title: '', progress: 30 });
  };
  const saveGoal = () => {
    const title = goalForm.title.trim() || `Improve my ${skill.name.toLowerCase()}`;
    updatePlayer((p) => ({ ...p, goals: [...(p.goals || []), { id: 'g' + Date.now(), skillId: skill.id, title, progress: goalForm.progress, created: new Date().toISOString() }] }));
    setGoalForm(null);
    setNote('Added to your goals.');
  };

  return (
    <main className="page">
      <button className="back" onClick={onBack}>‹ Skills</button>
      <section className="panel">
        <p className="eyebrow">{axisById[skill.axis].name}{skill.group !== skill.axis ? ` · ${groups.find((g) => g.id === skill.group)?.name}` : ''}</p>
        <h2 className="skill-title">{skill.name}</h2>
        {skill.aka && <p className="soft">Also called: {skill.aka}</p>}
        <p className="skill-what">{skill.what}</p>
        <p className="soft"><strong>When:</strong> {skill.when}</p>
      </section>

      {skill.checked ? (
        <section className="panel">
          <div className="row-between">
            <p className="eyebrow">Your level for this</p>
            <p className="pill">{check ? levelName(check.level) : '–'}</p>
          </div>
          {check?.from === 'quiz' && <p className="soft">From your quiz. Check it properly below.</p>}
          {!checking ? (
            described.length ? <button className="btn" onClick={() => setChecking(true)}>Check myself</button> : <p className="soft">Level descriptions coming soon.</p>
          ) : (
            <>
              <p className="insight">Which sounds most like you?</p>
              <div className="ob-answers">
                {described.map((l) => (
                  <button key={l.id} className={'ans' + (check?.level === l.id ? ' picked' : '')} onClick={() => saveCheck(l.id)}>
                    <strong>{l.name}.</strong> {skill.levels[l.id].text}
                  </button>
                ))}
                <button className="ans skip" onClick={() => setChecking(false)}>Not sure yet</button>
              </div>
            </>
          )}
        </section>
      ) : (
        <section className="panel"><p className="soft">This shot is in the glossary only. It isn't checked in the app.</p></section>
      )}

      <section className="panel">
        <p className="eyebrow">What it looks like at each level</p>
        <ul className="list">
          {levels.map((l) => (
            <li key={l.id} className={'list-row col' + (check?.level === l.id ? ' you' : '')}>
              <strong>{l.name}{check?.level === l.id ? ' (you)' : ''}</strong>
              <span className="soft">{l.id === 'Pro' ? 'Coming soon.' : skill.levels[l.id]?.text || (levelOrder(l.id) < levelOrder(skill.firstLevel) ? 'Not expected at this level.' : 'Description coming soon.')}</span>
            </li>
          ))}
        </ul>
      </section>

      {skill.checked && !goalForm && <button className="btn" onClick={makeGoal} disabled={isGoal}>{isGoal ? 'This is one of your goals' : 'Make this a goal'}</button>}
      {goalForm && (
        <section className="panel ob-form">
          <p className="eyebrow">New goal: {skill.name}</p>
          <label className="soft">What exactly do you want to get better at?
            <input value={goalForm.title} maxLength={60} placeholder={`e.g. ${goalIdea(skill)}`} onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })} />
          </label>
          <label className="soft">How happy are you with it right now? <strong className="goal-pct">{goalForm.progress}%</strong>
            <input type="range" className="slider" min="0" max="100" step="5" value={goalForm.progress} onChange={(e) => setGoalForm({ ...goalForm, progress: Number(e.target.value) })} />
          </label>
          <button className="btn" onClick={saveGoal}>Save goal</button>
          <button className="btn ghost" onClick={() => setGoalForm(null)}>Cancel</button>
        </section>
      )}
      {note && <p className="soft center">{note}</p>}
    </main>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import Pentagon from '../components/Pentagon.jsx';
import { axes, levels, groups, allSkills, allSkillById, axisById, goalDiagnosis as gd } from '../data.js';
import think from '../assets/mascot-think.png';
import StatementCheck from '../components/StatementCheck.jsx';
import QuickCheck from '../components/QuickCheck.jsx';
import CoachChat from '../components/CoachChat.jsx';
import { levelOrder, levelName, levelByOrder, skillChecks, currentAxisLevels, currentLevel, requiredFor, notYetLevel, topDescribed, firstMasterOrder, levelFocus, scoreSkill } from '../levels.js';

const views = [
  { id: 'have', label: 'My skills' },
  { id: 'next', label: 'Work on next' },
  { id: 'explore', label: 'Explore' },
];

export default function Skills({ player, updatePlayer, startView = 'have', openSkill = null }) {
  const [view, setView] = useState(startView || 'have');
  const [open, setOpen] = useState(openSkill);
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
  const strengthIds = new Set(allSkills.filter((s) => checks[s.id] && levelOrder(checks[s.id].level) > levelOrder(level)).map((s) => s.id));
  const checked = allSkills.filter((s) => checks[s.id] && (!area || s.axis === area) && (area || !strengthIds.has(s.id)));
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
        <p className="eyebrow">{area ? axisById[area].name : strengthIds.size ? 'Other skills you have checked' : 'Skills you have checked'}</p>
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
  const [all, setAll] = useState(false);
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
      <section className="panel focus-card">
        <p className="eyebrow">Your focus at {levelName(level)}</p>
        <p className="insight">{levelFocus(level)}</p>
      </section>
      <section className="panel">
        <p className="eyebrow">Gaps at your level ({levelName(level)})</p>
        <p className="soft">Skills a player at level {levelName(level)} usually has. Closing these makes your level solid.</p>
        {gaps.length ? <ul className="list">{gaps.map((r) => <Row key={r.s.id} skill={r.s} onOpen={onOpen} right={right(r)} />)}</ul> : <p className="insight">No gaps. Nice.</p>}
      </section>
      <section className="panel">
        <p className="eyebrow">Towards {levelName(nextLevel.id)}</p>
        <p className="soft">What the next level asks for.</p>
        {ahead.length ? <ul className="list">{(all ? ahead : ahead.slice(0, 8)).map((r) => <Row key={r.s.id} skill={r.s} onOpen={onOpen} right={right(r)} />)}</ul> : <p className="soft">Nothing listed yet.</p>}
        {ahead.length > 8 && <button className="mini" onClick={() => setAll(!all)}>{all ? 'Show fewer' : `Show all ${ahead.length}`}</button>}
      </section>
    </>
  );
}

function Explore({ onOpen }) {
  const [q, setQ] = useState('');
  // Ignore accents, so "vibora" finds "Víbora"
  const plain = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const term = plain(q.trim());
  const match = (s) => !term || plain([s.name, s.es, s.aka, s.what].join(' ')).includes(term);
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
              {items.map((s) => <Row key={s.id} skill={s} onOpen={onOpen} right={<span className="soft es">{s.es}</span>} />)}
            </ul>
          </section>
        );
      })}
    </>
  );
}

// The goal-setting coach (scripted for now): what's wrong, when, then a suggested goal.
function GoalChat({ skill, level, player, form, setForm, onSave, onCancel }) {
  const problems = gd.problemsByGroup[skill.group] || gd.problemsByGroup.attacking;
  // Padel words keep their capital (Bandeja); English names go lower case in a sentence ("your serve").
  const name = skill.name === skill.es ? skill.name : skill.name.toLowerCase();
  const line = (k) => gd.lines[k].replace('{skill}', name);
  const toggle = (id) => setForm({ ...form, problems: form.problems.includes(id) ? form.problems.filter((x) => x !== id) : form.problems.length < 2 ? [...form.problems, id] : form.problems });
  const goalFor = (p) => gd.goalOverrides?.[skill.id]?.[p.id] || p.goal;
  const suggestion = () => problems.filter((p) => form.problems.includes(p.id)).map(goalFor).map((t, i) => (i ? t[0].toLowerCase() + t.slice(1) : t)).join(', and ') || goalIdea(skill);
  const whenList = gd.whenOverrides?.skills.includes(skill.id) ? gd.when.map((w) => gd.whenOverrides.replace[w.id] || w) : gd.when;

  return (
    <section className="panel goal-chat">
      <p className="eyebrow">New goal · {skill.name}</p>
      {form.step === 'what' && (
        <>
          <div className="mascot-row"><img className="mascot-img small" src={think} alt="" /><div className="bubble">{line('what')}</div></div>
          <div className="chips">
            {problems.map((p) => <button key={p.id} className={'chip-btn skill' + (form.problems.includes(p.id) ? ' on' : '')} onClick={() => toggle(p.id)}>{p.label}</button>)}
          </div>
          <button className="btn" disabled={!form.problems.length} onClick={() => setForm({ ...form, step: 'when' })}>Next</button>
          <button className="btn ghost" onClick={() => setForm({ ...form, step: 'suggest', title: '' })}>Skip, I'll write my own</button>
          <button className="btn ghost" onClick={() => setForm({ ...form, step: 'coach' })}>Talk it through with the coach</button>
        </>
      )}
      {form.step === 'coach' && (
        <CoachChat
          mode="goal_setting"
          title="Goal-setting coach"
          vars={{ skill_name: skill.name, skill_id: skill.id }}
          player={player}
          skill={skill}
          onClose={() => setForm({ ...form, step: 'what' })}
          onProposal={(p) => { if (p.type === 'goal') setForm({ ...form, step: 'suggest', title: p.title || form.title, progress: typeof p.progress === 'number' ? p.progress : form.progress }); }}
        />
      )}
      {form.step === 'when' && (
        <>
          <div className="mascot-row"><img className="mascot-img small" src={think} alt="" /><div className="bubble">{line('when')}</div></div>
          <div className="chips">
            {whenList.map((w) => <button key={w.id} className={'chip-btn skill' + (form.when === w.id ? ' on' : '')} onClick={() => setForm({ ...form, when: w.id, step: 'suggest', title: form.title || suggestion() })}>{w.label}</button>)}
          </div>
          <button className="back" onClick={() => setForm({ ...form, step: 'what' })}>‹ Back</button>
        </>
      )}
      {form.step === 'suggest' && (
        <div className="ob-form">
          <div className="mascot-row"><img className="mascot-img small" src={think} alt="" /><div className="bubble">{form.problems.length || form.title ? line('suggest') : 'What do you want to change? In your own words.'}</div></div>
          <p className="soft">At {levelName(level)}, the priority is: <em>{levelFocus(level)}</em></p>
          <textarea rows="2" value={form.title} maxLength={80} placeholder={`e.g. ${goalIdea(skill)}`} onChange={(e) => setForm({ ...form, title: e.target.value })} aria-label="Your goal" />
          <label className="soft">{line('happy')} <strong className="goal-pct">{form.progress}%</strong>
            <input type="range" className="slider" min="0" max="100" step="5" value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
          </label>
          <button className="btn" onClick={onSave}>Save goal</button>
          {form.problems.length > 0 && <button className="back" onClick={() => setForm({ ...form, step: 'when' })}>‹ Back</button>}
        </div>
      )}
      <button className="btn ghost" onClick={onCancel}>Cancel</button>
    </section>
  );
}

// A concrete example goal, to show what "specific" looks like.
function goalIdea(skill) {
  const ideas = {
    serve: 'Serve deep to the backhand', volley: 'Keep my volleys low and deep', bandeja: 'Bandeja cross-court, not to the middle',
    net_play: 'Follow my lobs to the net', back_glass_return: 'Wait for the ball off the back glass', chiquita: 'Play one chiquita each game',
    composure: 'Same routine on big points', defensive_lob: 'Lob high and deep, not short',
  };
  return ideas[skill.id] || 'one thing you want to do better in matches';
}

// What to show for each level on a skill page.
function levelLine(skill, id) {
  if (id === 'Pro') return 'Coming soon.';
  if (skill.levels[id]) return skill.levels[id].text;
  const first = firstMasterOrder(skill);
  const top = topDescribed(skill);
  if (first !== null && levelOrder(id) < first) return 'Not expected yet at this level.';
  if (top && levelOrder(id) > levelOrder(top)) return `Same as ${levelName(top)}.`;
  return 'Not expected yet at this level.';
}

// After a check: the level it comes out as, and what's missing for the next step.
// Result of a quick check (you said your level, 4 questions confirmed it).
const OUTCOME = {
  solid_close: 'Solid, and close to the next level.',
  solid: 'Solid at this level.',
  not_solid: 'At this level, but not solid yet.',
  lower: 'Your answers sounded lower.',
  self: 'Set by you, not checked yet.',
  coach: 'Placed with the coach.',
};
function QuickSummary({ skill, check, onGoal }) {
  return (
    <div className="result-card">
      <p className="soft">
        You said {levelName(check.claimed)}. {OUTCOME[check.outcome]}
        {check.setByYou && check.outcome !== 'self' ? ' You kept your level.' : ''}
      </p>
      {check.focus?.length > 0 && (
        <div className="focus-point" style={{ marginTop: 8 }}>
          <p className="eyebrow">Point to work on</p>
          <p className="focus-text">{check.focus[0]}</p>
          {onGoal && <button className="mini on" onClick={() => onGoal(check.focus[0])}>Make this my goal</button>}
        </div>
      )}
    </div>
  );
}

function ResultCard({ skill, result }) {
  return (
    <div className="result-card">
      <p className="soft">From your answers, this comes out as <strong className="goal-pct">{skill.levels[result.level] || levelOrder(result.level) >= (firstMasterOrder(skill) ?? 0) ? levelName(result.level) : 'not yet'}</strong>.</p>
      {result.notMastered.length > 0 && (
        <>
          <p className="soft" style={{ marginTop: 8 }}>To make it solid (always, not just usually):</p>
          <ul className="gap-list soft">{result.notMastered.map((st) => <li key={st.id}>{st.text}</li>)}</ul>
        </>
      )}
      {result.gaps.length > 0 && (
        <>
          <p className="soft" style={{ marginTop: 8 }}>Next step{result.nextLevel ? ` (${levelName(result.nextLevel)})` : ''}:</p>
          <ul className="gap-list soft">{result.gaps.map((st) => <li key={st.id}>{st.text}</li>)}</ul>
        </>
      )}
    </div>
  );
}

function SkillPage({ skill, check, player, updatePlayer, onBack }) {
  const [checking, setChecking] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [justScored, setJustScored] = useState(null);
  const [chat, setChat] = useState(null); // 'diagnostic' | 'deep_dive'
  const [note, setNote] = useState('');
  const [goalForm, setGoalForm] = useState(null); // { title, progress }
  const described = levels.filter((l) => skill.levels[l.id]);
  const goals = player.goals || [];
  const isGoal = goals.some((g) => g.skillId === skill.id);

  const goalRef = useRef(null);
  useEffect(() => { if (goalForm) goalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [goalForm?.step]);
  const saveCheck = (answers) => {
    const result = scoreSkill(skill, answers);
    updatePlayer((p) => ({ ...p, skillChecks: { ...(p.skillChecks || {}), [skill.id]: { level: result.level, answers, mode: 'detail', date: new Date().toISOString() } } }));
    setChecking(false);
    setJustScored(result);
  };
  const saveQuick = (rec) => {
    updatePlayer((p) => ({ ...p, skillChecks: { ...(p.skillChecks || {}), [skill.id]: { ...rec, date: new Date().toISOString() } } }));
    setChecking(false);
    setJustScored(null);
  };
  const goalFromFocus = (text) => {
    if (isGoal) { setNote('This is already one of your goals.'); return; }
    if (goals.length >= 3) { setNote('You already have 3 goals. Finish or remove one first.'); return; }
    setGoalForm({ step: 'suggest', problems: [], when: '', title: text, progress: 30 });
  };
  const shown = justScored || (check?.mode !== 'quick' && check?.answers ? scoreSkill(skill, check.answers) : null);
  const startLevel = check && check.from !== 'quiz' ? check.level : currentAxisLevels(player)[skill.axis];
  const makeGoal = () => {
    if (isGoal) return;
    if (goals.length >= 3) { setNote('You already have 3 goals. Finish or remove one first.'); return; }
    setGoalForm({ step: 'what', problems: [], when: '', title: '', progress: 30 });
  };
  const saveGoal = () => {
    const title = goalForm.title.trim();
    const diagnosis = { problems: goalForm.problems, when: goalForm.when };
    updatePlayer((p) => ({ ...p, goals: [...(p.goals || []), { id: 'g' + Date.now(), skillId: skill.id, title, diagnosis, progress: goalForm.progress, created: new Date().toISOString() }] }));
    setGoalForm(null);
    setNote('Added to your goals.');
  };

  return (
    <main className="page">
      <button className="back" onClick={onBack}>‹ Skills</button>
      <section className="panel">
        <p className="eyebrow">{['transition', 'specialist'].includes(skill.group) ? groups.find((g) => g.id === skill.group)?.name : axisById[skill.axis].name}</p>
        <h2 className="skill-title">{skill.name}</h2>
        {skill.es && skill.es !== skill.name && <p className="soft">Spanish: <em>{skill.es}</em></p>}
        {skill.aka && skill.aka.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() !== skill.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() && <p className="soft">Also called: {skill.aka}</p>}
        <p className="skill-what">{skill.what}</p>
        <p className="soft"><strong>When:</strong> {skill.when}</p>
      </section>

      {skill.checked ? (
        <section className="panel">
          <div className="row-between">
            <p className="eyebrow">Your level for this</p>
            <p className="pill">{!check ? '–' : !skill.levels[check.level] && levelOrder(check.level) < (firstMasterOrder(skill) ?? 0) ? 'Not yet' : levelName(check.level)}</p>
          </div>
          {check?.from === 'quiz' && <p className="soft">From your quiz. Check it properly below.</p>}
          {!checking && (
            <>
              {check?.mode === 'quick' && <QuickSummary skill={skill} check={check} onGoal={!isGoal && goals.length < 3 ? goalFromFocus : null} />}
              {shown && <ResultCard skill={skill} result={shown} />}
              <button className="btn" onClick={() => setChecking('quick')}>{check?.outcome === 'self' ? 'Check it now' : check && check.from !== 'quiz' ? 'Check again' : 'Check my level'}</button>
              <button className="btn ghost" onClick={() => setChat('diagnostic')}>Talk it through with the coach</button>
              <button className="linkish center-self" onClick={() => setChecking('detail')}>Check in detail (all statements)</button>
            </>
          )}
          {checking === 'quick' && <QuickCheck skill={skill} startLevel={startLevel} onSave={saveQuick} onCancel={() => setChecking(false)} onDetail={() => setChecking('detail')} onGoal={goalFromFocus} />}
          {checking === 'detail' && <StatementCheck skill={skill} initial={check?.mode === 'detail' ? check.answers : {}} onSave={saveCheck} onSkip={() => setChecking(false)} skipLabel="Cancel" />}
        </section>
      ) : (
        <section className="panel"><p className="soft">This shot is in the glossary only. It isn't checked in the app.</p></section>
      )}

      {chat && (
        <CoachChat
          key={chat}
          mode={chat}
          title={chat === 'diagnostic' ? 'Coach: where are you with this?' : `Coach: ${skill.name} explained`}
          vars={{ skill_name: skill.name, skill_id: skill.id }}
          player={player}
          skill={skill}
          onClose={() => setChat(null)}
          onProposal={(p) => {
            if (p.type === 'skill_level' && p.level) {
              const lv = levels.find((l) => l.id.toLowerCase() === String(p.level).toLowerCase() || l.name.toLowerCase() === String(p.level).toLowerCase());
              if (lv) updatePlayer((pl) => ({ ...pl, skillChecks: { ...(pl.skillChecks || {}), [skill.id]: { level: lv.id, claimed: lv.id, outcome: 'coach', focus: [], reason: p.reason, mode: 'coach', date: new Date().toISOString() } } }));
            }
            if (p.type === 'goal' && p.title) goalFromFocus(p.title);
          }}
        />
      )}
      {!chat && skill.checked && <button className="btn ghost" onClick={() => setChat('deep_dive')}>Explain this skill and how to improve</button>}

      <section className="panel">
        <button className="row-between link-row" onClick={() => setShowLevels(!showLevels)} aria-expanded={showLevels}>
          <span className="eyebrow">What it looks like at each level</span><span className="chev">{showLevels ? '▾' : '▸'}</span>
        </button>
        {showLevels && <ul className="list">
          {levels.map((l) => (
            <li key={l.id} className={'list-row col' + (check?.level === l.id ? ' you' : '')}>
              <strong>{l.name}{check?.level === l.id ? ' (you)' : ''}</strong>
              <span className="soft">{check?.level === l.id && !skill.levels[l.id] ? 'From your answers: not yet. That\'s fine at this level.' : levelLine(skill, l.id)}</span>
            </li>
          ))}
        </ul>}
      </section>

      {skill.checked && !goalForm && <button className="btn" onClick={makeGoal} disabled={isGoal}>{isGoal ? 'This is one of your goals' : 'Make this a goal'}</button>}
      {goalForm && <div ref={goalRef} />}
      {goalForm && <GoalChat skill={skill} player={player} level={currentLevel(player)} form={goalForm} setForm={setGoalForm} onSave={saveGoal} onCancel={() => setGoalForm(null)} />}
      {note && <p className="soft center">{note}</p>}
    </main>
  );
}

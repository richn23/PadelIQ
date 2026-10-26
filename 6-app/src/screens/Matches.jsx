import React, { useState } from 'react';
import { allSkills, allSkillById, axes } from '../data.js';
import { skillChecks } from '../levels.js';
import { sortSessions, prettyDate, todayISO, sessionsUntilCheckIn } from '../sessions.js';

const emptyForm = { kind: 'match', date: todayISO(), time: '', venue: '', type: 'casual', partner: '', opp1: '', opp2: '', coach: '', focus: [] };
const checkOptions = [
  { id: 'better', label: 'Better' },
  { id: 'same', label: 'About the same' },
  { id: 'struggling', label: 'Still struggling' },
];

export default function Matches({ player, updatePlayer, onCheckIn }) {
  const [mode, setMode] = useState({ name: 'list' });
  const sessions = player.sessions || [];
  const { upcoming, played } = sortSessions(sessions);
  const goals = player.goals || [];

  const saveSession = (s) => {
    updatePlayer((p) => {
      const list = p.sessions || [];
      const exists = list.some((x) => x.id === s.id);
      return { ...p, sessions: exists ? list.map((x) => (x.id === s.id ? s : x)) : [...list, s] };
    });
  };
  const remove = (id) => {
    updatePlayer((p) => ({ ...p, sessions: (p.sessions || []).filter((x) => x.id !== id) }));
    setMode({ name: 'list' });
  };

  if (mode.name === 'add') {
    return <AddForm onCancel={() => setMode({ name: 'list' })} onSave={(s, reflectNow) => { saveSession(s); setMode(reflectNow ? { name: 'reflect', id: s.id } : { name: 'list' }); }} />;
  }
  const current = sessions.find((s) => s.id === mode.id);
  if (mode.name === 'targets' && current) {
    return <Targets session={current} goals={goals} onBack={() => setMode({ name: 'list' })} onSave={(targets) => { saveSession({ ...current, targets }); setMode({ name: 'list' }); }} />;
  }
  if (mode.name === 'reflect' && current) {
    return <Reflect session={current} player={player} goals={goals} onBack={() => setMode({ name: 'list' })} onSave={(s) => { saveSession(s); setMode({ name: 'detail', id: s.id }); }} />;
  }
  if (mode.name === 'detail' && current) {
    return <Detail session={current} goals={goals} onBack={() => setMode({ name: 'list' })} onEdit={() => setMode({ name: 'reflect', id: current.id })} onDelete={() => remove(current.id)} />;
  }

  const left = sessionsUntilCheckIn(player);
  return (
    <main className="page">
      <button className="btn" onClick={() => setMode({ name: 'add' })}>+ Add a match or lesson</button>
      {left === 0 ? (
        <section className="panel center">
          <p className="insight">Check-in due</p>
          <p className="soft">Re-check about 10 skills. Takes 2 minutes.</p>
          <button className="btn" onClick={onCheckIn}>Start check-in</button>
        </section>
      ) : (
        <p className="soft center">Check-in in {left} session{left === 1 ? '' : 's'}. <button className="linkish" onClick={onCheckIn}>Check in now</button></p>
      )}

      <section className="panel">
        <p className="eyebrow">Upcoming</p>
        {upcoming.length === 0 ? <p className="soft">Nothing planned.</p> : (
          <ul className="list">
            {upcoming.map((s) => (
              <li key={s.id} className="session">
                <div>
                  <p className="session-when">{prettyDate(s.date, s.time)}</p>
                  <p className="soft">{summary(s)}</p>
                  {s.targets?.length > 0 && <p className="soft">Targets: {s.targets.map((id) => goals.find((g) => g.id === id)?.title).filter(Boolean).join(', ')}</p>}
                </div>
                <div className="session-actions">
                  {goals.length > 0 && <button className="mini" onClick={() => setMode({ name: 'targets', id: s.id })}>Targets</button>}
                  <button className="mini on" onClick={() => setMode({ name: 'reflect', id: s.id })}>Done: reflect</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <p className="eyebrow">Played</p>
        {played.length === 0 ? <p className="soft">Nothing yet. After each session: a quick goal check and three short notes.</p> : (
          <ul className="list">
            {played.map((s) => (
              <li key={s.id}>
                <button className="list-row link" onClick={() => setMode({ name: 'detail', id: s.id })}>
                  <span>
                    <span className="session-when">{prettyDate(s.date)}</span>
                    <span className="soft block">{summary(s)}</span>
                  </span>
                  <span className="row-right">{s.kind === 'match' && s.result?.outcome && <span className={'tag ' + s.result.outcome}>{s.result.outcome}</span>}<span className="chev">›</span></span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function summary(s) {
  if (s.kind === 'lesson') return `Lesson${s.coach ? ' with ' + s.coach : ''}${s.venue ? ' · ' + s.venue : ''}`;
  const opp = [s.opponents?.[0], s.opponents?.[1]].filter(Boolean).join(' & ');
  return [s.partner && `With ${s.partner}`, opp && `vs ${opp}`, s.venue].filter(Boolean).join(' · ') || 'Match';
}

function AddForm({ onCancel, onSave }) {
  const [f, setF] = useState(emptyForm);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const build = () => ({
    id: 's' + Date.now(),
    kind: f.kind,
    date: f.date,
    time: f.time,
    venue: f.venue.trim(),
    type: f.kind === 'match' ? f.type : undefined,
    partner: f.kind === 'match' ? f.partner.trim() : undefined,
    opponents: f.kind === 'match' ? [f.opp1.trim(), f.opp2.trim()] : undefined,
    coach: f.kind === 'lesson' ? f.coach.trim() : undefined,
    focus: f.kind === 'lesson' ? f.focus : undefined,
    targets: [],
    status: 'planned',
    createdAt: new Date().toISOString(),
  });
  const past = f.date <= todayISO();
  return (
    <main className="page">
      <button className="back" onClick={onCancel}>‹ Matches</button>
      <div className="segmented">
        <button className={f.kind === 'match' ? 'on' : ''} onClick={() => setF({ ...f, kind: 'match' })}>Match</button>
        <button className={f.kind === 'lesson' ? 'on' : ''} onClick={() => setF({ ...f, kind: 'lesson' })}>Lesson</button>
      </div>
      <section className="panel ob-form">
        <div className="two">
          <label className="soft">Date<input type="date" value={f.date} onChange={set('date')} /></label>
          <label className="soft">Time<input type="time" value={f.time} onChange={set('time')} /></label>
        </div>
        <label className="soft">Where<input value={f.venue} onChange={set('venue')} placeholder="Club or court" /></label>
        {f.kind === 'match' ? (
          <>
            <label className="soft">Partner<input value={f.partner} onChange={set('partner')} /></label>
            <div className="two">
              <label className="soft">Opponent 1<input value={f.opp1} onChange={set('opp1')} /></label>
              <label className="soft">Opponent 2<input value={f.opp2} onChange={set('opp2')} /></label>
            </div>
            <label className="soft">Type
              <select value={f.type} onChange={set('type')}>
                <option value="casual">Casual</option><option value="competitive">Competitive</option><option value="league">League</option><option value="practice">Practice</option>
              </select>
            </label>
          </>
        ) : (
          <>
            <label className="soft">Coach<input value={f.coach} onChange={set('coach')} /></label>
            <p className="soft">What will it focus on?</p>
            <SkillChips selected={f.focus} onChange={(focus) => setF({ ...f, focus })} />
          </>
        )}
      </section>
      {past && <button className="btn" onClick={() => onSave(build(), true)}>Save and reflect now</button>}
      <button className={'btn' + (past ? ' ghost' : '')} onClick={() => onSave(build(), false)}>Save as upcoming</button>
    </main>
  );
}

function SkillChips({ selected, onChange, prefer = [] }) {
  const [area, setArea] = useState(null);
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const list = allSkills.filter((s) => s.checked && (area ? s.axis === area : prefer.length ? prefer.includes(s.id) || selected.includes(s.id) : true));
  return (
    <div className="chip-picker">
      <div className="chips">
        {prefer.length > 0 && <button className={'chip-btn' + (!area ? ' on' : '')} onClick={() => setArea(null)}>Suggested</button>}
        {axes.map((a) => <button key={a.id} className={'chip-btn' + (area === a.id ? ' on' : '')} onClick={() => setArea(area === a.id ? null : a.id)}>{a.name.split(' and ')[0]}</button>)}
      </div>
      <div className="chips">
        {list.map((s) => <button key={s.id} className={'chip-btn skill' + (selected.includes(s.id) ? ' on' : '')} onClick={() => toggle(s.id)}>{s.name}</button>)}
      </div>
    </div>
  );
}

function Targets({ session, goals, onBack, onSave }) {
  const [t, setT] = useState(session.targets || []);
  const toggle = (id) => setT(t.includes(id) ? t.filter((x) => x !== id) : t.length < 3 ? [...t, id] : t);
  return (
    <main className="page">
      <button className="back" onClick={onBack}>‹ Matches</button>
      <section className="panel">
        <p className="eyebrow">Before: today's targets</p>
        <p className="soft">Pick up to 3 goals to think about. Keep it light.</p>
        <div className="ob-answers" style={{ marginTop: 10 }}>
          {goals.map((g) => <button key={g.id} className={'ans' + (t.includes(g.id) ? ' picked' : '')} onClick={() => toggle(g.id)}>{t.includes(g.id) ? '✓ ' : ''}{g.title}</button>)}
        </div>
      </section>
      <button className="btn" onClick={() => onSave(t)}>Save targets</button>
    </main>
  );
}

function Reflect({ session, player, goals, onBack, onSave }) {
  const toCheck = (session.targets?.length ? goals.filter((g) => session.targets.includes(g.id)) : goals);
  const [checks, setChecks] = useState(session.goalChecks || {});
  const [outcome, setOutcome] = useState(session.result?.outcome || '');
  const [score, setScore] = useState(session.result?.score || '');
  const [notes, setNotes] = useState(session.notes || { worked: '', didnt: '', tryNext: '' });
  const [tags, setTags] = useState(session.tags || session.focus || []);
  const [coachSaid, setCoachSaid] = useState(session.coachSaid || '');
  const [practice, setPractice] = useState(session.practice || '');
  const prefer = [...new Set([...goals.map((g) => g.skillId), ...(session.focus || []), ...Object.keys(skillChecks(player))])];
  const setNote = (k) => (e) => setNotes({ ...notes, [k]: e.target.value });

  const save = () => onSave({
    ...session,
    status: 'played',
    playedAt: session.playedAt || new Date().toISOString(),
    result: session.kind === 'match' ? { outcome, score: score.trim() } : undefined,
    goalChecks: checks,
    notes,
    tags,
    coachSaid: session.kind === 'lesson' ? coachSaid : undefined,
    practice: session.kind === 'lesson' ? practice : undefined,
  });

  return (
    <main className="page">
      <button className="back" onClick={onBack}>‹ Matches</button>
      <p className="eyebrow center">{session.kind === 'lesson' ? 'After the lesson' : 'After the match'} · {prettyDate(session.date)}</p>

      {session.kind === 'match' && (
        <section className="panel">
          <p className="eyebrow">Result (optional)</p>
          <div className="segmented" style={{ marginTop: 8 }}>
            {['won', 'lost', 'draw'].map((o) => <button key={o} className={outcome === o ? 'on' : ''} onClick={() => setOutcome(outcome === o ? '' : o)}>{o[0].toUpperCase() + o.slice(1)}</button>)}
          </div>
          <input className="search" style={{ marginTop: 10 }} placeholder="Score, e.g. 6-4 3-6 7-5" value={score} onChange={(e) => setScore(e.target.value)} />
        </section>
      )}

      {session.kind === 'lesson' && (
        <section className="panel ob-form">
          <label className="soft">What did the coach say?<textarea rows="3" value={coachSaid} onChange={(e) => setCoachSaid(e.target.value)} /></label>
          <label className="soft">Your practice task<input value={practice} onChange={(e) => setPractice(e.target.value)} /></label>
        </section>
      )}

      {toCheck.length > 0 && (
        <section className="panel">
          <p className="eyebrow">Your goals</p>
          {toCheck.map((g) => (
            <div key={g.id} className="goal-check">
              <p className="goal-title">{g.title}</p>
              <div className="segmented small">
                {checkOptions.map((o) => <button key={o.id} className={checks[g.id] === o.id ? 'on' : ''} onClick={() => setChecks({ ...checks, [g.id]: o.id })}>{o.label}</button>)}
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="panel ob-form">
        <p className="eyebrow">Three quick notes</p>
        <label className="soft">What worked?<textarea rows="2" value={notes.worked} onChange={setNote('worked')} /></label>
        <label className="soft">What didn't?<textarea rows="2" value={notes.didnt} onChange={setNote('didnt')} /></label>
        <label className="soft">One thing to try next time<textarea rows="2" value={notes.tryNext} onChange={setNote('tryNext')} /></label>
      </section>

      <section className="panel">
        <p className="eyebrow">Which skills came up? (tap any)</p>
        <SkillChips selected={tags} onChange={setTags} prefer={prefer} />
      </section>

      <p className="soft center">This never changes your level. It helps you and your coach spot patterns.</p>
      <button className="btn" onClick={save}>Save</button>
    </main>
  );
}

function Detail({ session, goals, onBack, onEdit, onDelete }) {
  const [sure, setSure] = useState(false);
  const label = { better: 'Better', same: 'About the same', struggling: 'Still struggling' };
  return (
    <main className="page">
      <button className="back" onClick={onBack}>‹ Matches</button>
      <section className="panel">
        <p className="eyebrow">{session.kind === 'lesson' ? 'Lesson' : 'Match'} · {prettyDate(session.date, session.time)}</p>
        <p className="insight">{summary(session)}</p>
        {session.result?.outcome && <p className="soft">Result: {session.result.outcome}{session.result.score ? ` (${session.result.score})` : ''}</p>}
      </section>
      {session.kind === 'lesson' && (session.coachSaid || session.practice) && (
        <section className="panel">
          {session.coachSaid && <><p className="eyebrow">Coach said</p><p className="note">{session.coachSaid}</p></>}
          {session.practice && <><p className="eyebrow">Practice task</p><p className="note">{session.practice}</p></>}
        </section>
      )}
      {Object.keys(session.goalChecks || {}).length > 0 && (
        <section className="panel">
          <p className="eyebrow">Goals</p>
          <ul className="list">
            {Object.entries(session.goalChecks).map(([id, v]) => <li key={id} className="list-row"><span>{goals.find((g) => g.id === id)?.title || 'Old goal'}</span><span className={'tag ' + v}>{label[v]}</span></li>)}
          </ul>
        </section>
      )}
      <section className="panel">
        <p className="eyebrow">What worked</p><p className="note">{session.notes?.worked || '–'}</p>
        <p className="eyebrow">What didn't</p><p className="note">{session.notes?.didnt || '–'}</p>
        <p className="eyebrow">Try next time</p><p className="note">{session.notes?.tryNext || '–'}</p>
        {session.tags?.length > 0 && <div className="chips" style={{ marginTop: 8 }}>{session.tags.map((t) => <span key={t} className="chip">{allSkillById[t]?.name}</span>)}</div>}
      </section>
      <button className="btn ghost" onClick={onEdit}>Edit reflection</button>
      {!sure ? <button className="btn ghost" onClick={() => setSure(true)}>Delete</button> : <button className="btn danger" onClick={onDelete}>Tap again to delete</button>}
    </main>
  );
}

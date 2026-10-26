import React, { useEffect, useState } from 'react';
import { allSkills, allSkillById, axes } from '../data.js';
import { skillChecks } from '../levels.js';
import { goalSkill, goalNote, goalLine } from '../goals.js';
import CoachChat from '../components/CoachChat.jsx';
import { sessionSummary, preMatchOpener } from '../coach.js';
import { sortSessions, prettyDate, todayISO, sessionsUntilCheckIn } from '../sessions.js';

const emptyForm = { kind: 'match', date: todayISO(), time: '', venue: '', type: 'casual', partner: '', opp1: '', opp2: '', coach: '', focus: [], intention: '' };
const planOptions = [
  { id: 'yes', label: 'Yes' },
  { id: 'partly', label: 'Partly' },
  { id: 'no', label: 'Not really' },
];
const checkOptions = [
  { id: 'better', label: 'Better' },
  { id: 'same', label: 'About the same' },
  { id: 'struggling', label: 'Still struggling' },
];

const MODE_KEY = 'padeliq-matches-mode';
const loadMode = () => { try { return JSON.parse(sessionStorage.getItem(MODE_KEY) || 'null'); } catch { return null; } };

export default function Matches({ player, updatePlayer, onCheckIn, openPlan, openReflect, fresh }) {
  const [mode, setModeRaw] = useState(() => (openPlan ? { name: 'targets', id: openPlan } : openReflect ? { name: 'reflect', id: openReflect } : (!fresh && loadMode()) || { name: 'list' }));
  useEffect(() => { try { sessionStorage.setItem(MODE_KEY, JSON.stringify(mode.name === 'add' || mode.name === 'edit' ? { name: 'list' } : mode)); } catch { /* ignore */ } }, []); // remember where we opened
  const setMode = (m) => {
    setModeRaw(m);
    try { sessionStorage.setItem(MODE_KEY, JSON.stringify(m.name === 'add' || m.name === 'edit' ? { name: 'list' } : m)); } catch { /* ignore */ }
    window.scrollTo(0, 0);
  };
  const [day, setDay] = useState(null);
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

  if (mode.name === 'edit' && sessions.find((s) => s.id === mode.id)) {
    const cur = sessions.find((s) => s.id === mode.id);
    return <AddForm initial={cur} onCancel={() => setMode({ name: 'list' })} onDelete={() => remove(cur.id)} onSave={(s) => { saveSession({ ...cur, ...s, id: cur.id, status: cur.status, targets: cur.targets }); setMode({ name: 'list' }); }} />;
  }
  if (mode.name === 'add') {
    return <AddForm date={mode.date} onCancel={() => setMode({ name: 'list' })} onSave={(s, reflectNow) => { saveSession(s); setMode(reflectNow ? { name: 'reflect', id: s.id } : { name: 'list' }); }} />;
  }
  const current = sessions.find((s) => s.id === mode.id);
  if (mode.name === 'targets' && current) {
    return <Plan session={current} goals={goals} player={player} onBack={() => setMode({ name: 'list' })} onSave={(plan) => { saveSession({ ...current, ...plan }); setMode({ name: 'list' }); }} />;
  }
  if (mode.name === 'reflect' && current) {
    return <Reflect session={current} player={player} goals={goals} onBack={() => setMode({ name: 'list' })} onSave={(s) => { saveSession(s); setMode({ name: 'detail', id: s.id }); }} />;
  }
  if (mode.name === 'detail' && current) {
    return <Detail session={current} goals={goals} onBack={() => setMode({ name: 'list' })} onEdit={() => setMode({ name: 'reflect', id: current.id })} onDelete={() => remove(current.id)} />;
  }

  const left = sessionsUntilCheckIn(player);
  const shownUp = day ? upcoming.filter((s) => s.date === day) : upcoming;
  const shownPlayed = day ? played.filter((s) => s.date === day) : played;
  return (
    <main className="page">
      <button className="btn" onClick={() => setMode({ name: 'add', date: day || undefined })}>+ Add a match or lesson{day ? ` on ${prettyDate(day)}` : ''}</button>
      <Calendar sessions={sessions} day={day} onDay={(d) => setDay(day === d ? null : d)} />
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
        <p className="eyebrow">{day ? `Planned on ${prettyDate(day)}` : 'Upcoming'}</p>
        {shownUp.length === 0 ? <p className="soft">Nothing planned.</p> : (
          <ul className="list">
            {shownUp.map((s) => (
              <li key={s.id} className="session">
                <div>
                  <p className="session-when">{prettyDate(s.date, s.time)}</p>
                  <p className="soft">{summary(s)}</p>
                  {s.intention && <p className="soft">Intention: <em>{s.intention}</em></p>}
                  {s.targets?.length > 0 && <p className="soft">Goals: {s.targets.map((id) => goals.find((g) => g.id === id)).filter(Boolean).map(goalLine).join(', ')}</p>}
                </div>
                <div className="session-actions">
                  {s.date < todayISO()
                    ? <button className="mini on" onClick={() => setMode({ name: 'reflect', id: s.id })}>Did you play? Reflect now</button>
                    : <>
                        <button className="mini" onClick={() => setMode({ name: 'targets', id: s.id })}>Plan</button>
                        {s.date === todayISO() && <button className="mini on" onClick={() => setMode({ name: 'reflect', id: s.id })}>Done: reflect</button>}
                      </>}
                  <button className="mini quiet" onClick={() => setMode({ name: 'edit', id: s.id })}>Edit</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <p className="eyebrow">{day ? `Played on ${prettyDate(day)}` : 'Played'}</p>
        {shownPlayed.length === 0 ? <p className="soft">Nothing yet. After each session: a quick goal check and three short notes.</p> : (
          <ul className="list">
            {shownPlayed.map((s) => (
              <li key={s.id}>
                <button className="list-row link" onClick={() => setMode({ name: 'detail', id: s.id })}>
                  <span>
                    <span className="session-when">{prettyDate(s.date)}</span>
                    <span className="soft block">{summary(s)}</span>
                  </span>
                  <span className="row-right">{s.kind === 'match' && s.result?.outcome && <span className={'tag ' + s.result.outcome}>{cap(s.result.outcome)}</span>}<span className="chev">›</span></span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

const cap = (t) => (t ? t[0].toUpperCase() + t.slice(1) : t);

function summary(s) {
  if (s.kind === 'lesson') return `Lesson${s.coach ? ' with ' + s.coach : ''}${s.venue ? ' · ' + s.venue : ''}`;
  const opp = [s.opponents?.[0], s.opponents?.[1]].filter(Boolean).join(' & ');
  return [s.partner && `With ${s.partner}`, opp && `vs ${opp}`, s.venue].filter(Boolean).join(' · ') || 'Match';
}

function AddForm({ date, initial, onCancel, onSave, onDelete }) {
  const [sure, setSure] = useState(false);
  const [f, setF] = useState(() => initial
    ? { ...emptyForm, ...initial, opp1: initial.opponents?.[0] || '', opp2: initial.opponents?.[1] || '', venue: initial.venue || '', partner: initial.partner || '', coach: initial.coach || '', focus: initial.focus || [], intention: initial.intention || '', time: initial.time || '' }
    : { ...emptyForm, date: date || todayISO() });
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
    intention: f.intention.trim(),
    targets: [],
    status: 'planned',
    createdAt: new Date().toISOString(),
  });
  const past = !initial && f.date <= todayISO();
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
            <label className="soft">Opponent 1<input value={f.opp1} onChange={set('opp1')} /></label>
            <label className="soft">Opponent 2<input value={f.opp2} onChange={set('opp2')} /></label>
            <label className="soft">Type
              <select value={f.type} onChange={set('type')}>
                <option value="casual">Casual</option><option value="competitive">Competitive</option><option value="league">League</option><option value="practice">Practice</option>
              </select>
            </label>
          </>
        ) : (
          <>
            <label className="soft">Coach's name<input value={f.coach} onChange={set('coach')} /></label>
            <p className="soft">What will it focus on?</p>
            <SkillChips selected={f.focus} onChange={(focus) => setF({ ...f, focus })} />
          </>
        )}
        <label className="soft">Your intention for this {f.kind} (optional)
          <input value={f.intention} maxLength={80} placeholder={f.kind === 'match' ? 'e.g. Be patient and lob more' : 'e.g. Fix my bandeja contact point'} onChange={set('intention')} />
        </label>
      </section>
      {past && <button className="btn" onClick={() => onSave(build(), true)}>Save and reflect now</button>}
      <button className={'btn' + (past ? ' ghost' : '')} onClick={() => onSave(build(), false)}>{initial ? 'Save changes' : past ? 'Save, reflect later' : 'Save as upcoming'}</button>
      {initial && (!sure ? <button className="btn ghost" onClick={() => setSure(true)}>Delete</button> : <button className="btn danger" onClick={onDelete}>Tap again to delete</button>)}
    </main>
  );
}

export function SkillChips({ selected, onChange, prefer = [] }) {
  const [area, setArea] = useState(null);
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const list = allSkills.filter((s) => s.checked && (area ? s.axis === area : prefer.includes(s.id) || selected.includes(s.id)));
  return (
    <div className="chip-picker">
      <div className="chips">
        {prefer.length > 0 && <button className={'chip-btn area' + (!area ? ' on' : '')} onClick={() => setArea(null)}>Suggested</button>}
        {axes.map((a) => <button key={a.id} className={'chip-btn area' + (area === a.id ? ' on' : '')} onClick={() => setArea(area === a.id ? null : a.id)}>{a.name.split(' and ')[0]}</button>)}
      </div>
      {list.length === 0 && <p className="soft">Pick an area to see its skills.</p>}
      <div className="chips">
        {list.map((s) => <button key={s.id} className={'chip-btn skill' + (selected.includes(s.id) ? ' on' : '')} onClick={() => toggle(s.id)}>{s.name}</button>)}
      </div>
    </div>
  );
}

function Plan({ session, goals, player, onBack, onSave }) {
  const [brief, setBrief] = useState(false);
  const [t, setT] = useState(session.targets || []);
  const [intention, setIntention] = useState(session.intention || '');
  const toggle = (id) => setT(t.includes(id) ? t.filter((x) => x !== id) : t.length < 3 ? [...t, id] : t);
  return (
    <main className="page">
      <button className="back" onClick={onBack}>‹ Matches</button>
      <p className="eyebrow center">Before · {prettyDate(session.date, session.time)}</p>
      <section className="panel ob-form">
        <p className="eyebrow">Your intention</p>
        <label className="soft">One thing you want to do in this {session.kind}
          <input value={intention} maxLength={80} placeholder="e.g. Be patient and lob more" onChange={(e) => setIntention(e.target.value)} />
        </label>
      </section>
      <section className="panel">
        <p className="eyebrow">Goals for this {session.kind}</p>
        {goals.length === 0 ? <p className="soft">No goals yet. You can add them from the Skills tab.</p> : (
          <>
            <p className="soft">Pick up to 3. Keep it light.</p>
            <div className="ob-answers" style={{ marginTop: 10 }}>
              {goals.map((g) => <button key={g.id} className={'ans' + (t.includes(g.id) ? ' picked' : '')} onClick={() => toggle(g.id)}><strong>{t.includes(g.id) ? '✓ ' : ''}{goalSkill(g)}</strong>{goalNote(g) && <span className="block soft">{goalNote(g)}</span>}</button>)}
            </div>
          </>
        )}
      </section>
      {!brief
        ? <button className="btn ghost" onClick={() => setBrief(true)}>Get a pre-match brief from the coach</button>
        : <CoachChat mode="pre_match" title="Pre-match coach" vars={{ session_summary: sessionSummary({ ...session, intention }) }} player={player} intro={preMatchOpener(player, { ...session, intention, targets: t })} onClose={() => setBrief(false)} />}
      <button className="btn" onClick={() => onSave({ targets: t, intention: intention.trim() })}>Save plan</button>
    </main>
  );
}

// Drafts survive the phone reloading the page (it often does after switching apps).
const draftKey = (id) => `padeliq-draft-${id}`;
const loadDraft = (id) => { try { return JSON.parse(localStorage.getItem(draftKey(id)) || 'null'); } catch { return null; } };
const saveDraft = (id, d) => { try { localStorage.setItem(draftKey(id), JSON.stringify(d)); } catch { /* ignore */ } };
const clearDraft = (id) => { try { localStorage.removeItem(draftKey(id)); } catch { /* ignore */ } };

function Reflect({ session, player, goals, onBack, onSave }) {
  const toCheck = (session.targets?.length ? goals.filter((g) => session.targets.includes(g.id)) : goals);
  const [d, setD] = useState(() => loadDraft(session.id) || {
    checks: session.goalChecks || {},
    planCheck: session.intentionCheck || '',
    outcome: session.result?.outcome || '',
    score: session.result?.score || '',
    notes: session.notes || { worked: '', didnt: '', tryNext: '' },
    tags: session.tags || session.focus || [],
    coachSaid: session.coachSaid || '',
    practice: session.practice || '',
  });
  const set = (patch) => setD((prev) => { const next = { ...prev, ...patch }; saveDraft(session.id, next); return next; });
  const hasNotes = Object.values(d.notes).some(Boolean) || d.coachSaid || d.practice;
  const [showNotes, setShowNotes] = useState(hasNotes || session.kind === 'lesson');
  const [showScore, setShowScore] = useState(!!d.score);
  const [chat, setChat] = useState(false);
  const prefer = [...new Set([...goals.map((g) => g.skillId), ...(session.focus || []), ...Object.keys(skillChecks(player))])];
  const setNote = (k) => (e) => set({ notes: { ...d.notes, [k]: e.target.value } });

  const save = () => {
    clearDraft(session.id);
    onSave({
      ...session,
      status: 'played',
      playedAt: session.playedAt || new Date().toISOString(),
      result: session.kind === 'match' ? { outcome: d.outcome, score: d.score.trim() } : undefined,
      goalChecks: d.checks,
      intentionCheck: session.intention ? d.planCheck : undefined,
      notes: d.notes,
      tags: d.tags,
      coachSaid: session.kind === 'lesson' ? d.coachSaid : undefined,
      practice: session.kind === 'lesson' ? d.practice : undefined,
    });
  };

  return (
    <main className="page">
      <button className="back" onClick={onBack}>‹ Matches</button>
      <p className="eyebrow center">{session.kind === 'lesson' ? 'After the lesson' : 'After the match'} · {prettyDate(session.date)}</p>
      <p className="soft center">A few taps. Notes are optional.</p>

      {session.kind === 'match' && (
        <section className="panel">
          <p className="eyebrow">Result</p>
          <div className="segmented" style={{ marginTop: 8 }}>
            {['won', 'lost', 'draw'].map((o) => <button key={o} className={d.outcome === o ? 'on' : ''} onClick={() => set({ outcome: d.outcome === o ? '' : o })}>{cap(o)}</button>)}
          </div>
          {showScore
            ? <input className="search" style={{ marginTop: 10 }} placeholder="e.g. 6-4 3-6 7-5" value={d.score} onChange={(e) => set({ score: e.target.value })} aria-label="Score" />
            : <button className="linkish" style={{ marginTop: 8 }} onClick={() => setShowScore(true)}>+ Add the score</button>}
        </section>
      )}

      {session.intention && (
        <section className="panel">
          <p className="eyebrow">Your intention</p>
          <p className="goal-title" style={{ margin: '6px 0 10px' }}>{session.intention}</p>
          <div className="segmented small">
            {planOptions.map((o) => <button key={o.id} className={d.planCheck === o.id ? 'on' : ''} onClick={() => set({ planCheck: o.id })}>{o.label}</button>)}
          </div>
        </section>
      )}

      {toCheck.length > 0 && (
        <section className="panel">
          <p className="eyebrow">Your goals</p>
          {toCheck.map((g) => (
            <div key={g.id} className="goal-check">
              <p className="goal-title">{goalSkill(g)}</p>
              {goalNote(g) && <p className="goal-note">{goalNote(g)}</p>}
              <div className="segmented small">
                {checkOptions.map((o) => <button key={o.id} className={d.checks[g.id] === o.id ? 'on' : ''} onClick={() => set({ checks: { ...d.checks, [g.id]: o.id } })}>{o.label}</button>)}
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="panel">
        <p className="eyebrow">Which skills came up?</p>
        <SkillChips selected={d.tags} onChange={(tags) => set({ tags })} prefer={prefer} />
      </section>

      {showNotes ? (
        <section className="panel ob-form">
          <p className="eyebrow">Notes (optional)</p>
          {session.kind === 'lesson' && (
            <>
              <label className="soft">What did the coach say?<textarea rows="2" placeholder="e.g. Racket up earlier on the bandeja" value={d.coachSaid} onChange={(e) => set({ coachSaid: e.target.value })} /></label>
              <label className="soft">Your practice task<input placeholder="e.g. 20 bandejas cross-court" value={d.practice} onChange={(e) => set({ practice: e.target.value })} /></label>
            </>
          )}
          <label className="soft">What worked?<textarea rows="2" placeholder="e.g. Lobbing over the left player" value={d.notes.worked} onChange={setNote('worked')} /></label>
          <label className="soft">What didn't?<textarea rows="2" placeholder="e.g. My returns sat up" value={d.notes.didnt} onChange={setNote('didnt')} /></label>
          <label className="soft">One thing to try next time<textarea rows="2" placeholder="e.g. Return low to the middle" value={d.notes.tryNext} onChange={setNote('tryNext')} /></label>
        </section>
      ) : (
        <button className="btn ghost" onClick={() => setShowNotes(true)}>+ Add notes (optional)</button>
      )}

      {!chat
        ? <button className="btn ghost" onClick={() => setChat(true)}>Talk it through with the coach</button>
        : <CoachChat
            mode="post_match"
            title="Post-match coach"
            vars={{ session_summary: sessionSummary(session) }}
            player={player}
            onClose={() => setChat(false)}
            onProposal={(p) => {
              if (p.type !== 'reflection') return;
              const n = p.notes || {};
              const merge = (a, b) => (b ? (a ? `${a} ${b}` : b) : a);
              set({ notes: { worked: merge(d.notes.worked, n.worked), didnt: merge(d.notes.didnt, n.didnt), tryNext: merge(d.notes.tryNext, n.tryNext) }, tags: [...new Set([...d.tags, ...(p.tags || [])])] });
              setShowNotes(true);
            }}
          />}

      <p className="soft center">This never changes your level. It helps you spot patterns.</p>
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
        {session.result?.outcome && <p className="soft">Result: {cap(session.result.outcome)}{session.result.score ? ` (${session.result.score})` : ''}</p>}
      </section>
      {session.kind === 'lesson' && (session.coachSaid || session.practice) && (
        <section className="panel">
          {session.coachSaid && <><p className="eyebrow">Coach said</p><p className="note">{session.coachSaid}</p></>}
          {session.practice && <><p className="eyebrow">Practice task</p><p className="note">{session.practice}</p></>}
        </section>
      )}
      {session.intention && (
        <section className="panel">
          <p className="eyebrow">Intention</p>
          <p className="note">{session.intention}{session.intentionCheck ? ` · ${{ yes: 'Managed it', partly: 'Partly', no: 'Not really' }[session.intentionCheck]}` : ''}</p>
        </section>
      )}
      {Object.keys(session.goalChecks || {}).length > 0 && (
        <section className="panel">
          <p className="eyebrow">Goals</p>
          <ul className="list">
            {Object.entries(session.goalChecks).map(([id, v]) => <li key={id} className="list-row"><span>{goals.find((g) => g.id === id) ? goalLine(goals.find((g) => g.id === id)) : 'Old goal'}</span><span className={'tag ' + v}>{label[v]}</span></li>)}
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

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function Calendar({ sessions, day, onDay }) {
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const first = new Date(month);
  const offset = (first.getDay() + 6) % 7; // Monday first
  const daysIn = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysIn }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  const byDay = {};
  sessions.forEach((s) => { (byDay[s.date] = byDay[s.date] || []).push(s); });
  const today = iso(new Date());
  const shift = (n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  return (
    <section className="panel cal">
      <div className="row-between">
        <button className="cal-nav" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
        <p className="cal-title">{month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        <button className="cal-nav" onClick={() => shift(1)} aria-label="Next month">›</button>
      </div>
      <div className="cal-grid">
        {WEEKDAYS.map((w, i) => <span key={i} className="cal-wd">{w}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const k = iso(d);
          const list = byDay[k] || [];
          return (
            <button key={i} className={'cal-day' + (k === today ? ' today' : '') + (k === day ? ' on' : '')} onClick={() => onDay(k)} aria-label={`${d.getDate()}${list.length ? `, ${list.length} session${list.length > 1 ? 's' : ''}` : ''}`}>
              {d.getDate()}
              <span className="cal-dots">
                {list.slice(0, 3).map((s) => <i key={s.id} className={s.status === 'played' ? 'played' : 'planned'} />)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="soft cal-key"><i className="planned" /> planned <i className="played" /> played{day ? ' · tap the day again to see all' : ''}</p>
    </section>
  );
}

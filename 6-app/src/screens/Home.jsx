import React, { useEffect, useRef, useState } from 'react';
import Pentagon from '../components/Pentagon.jsx';
import SkillBars from '../components/SkillBars.jsx';
import { axes, axisById, levels, allSkills, allSkillById as skillById } from '../data.js';
import { currentAxisLevels, currentAxisScores, currentLevel, skillChecks } from '../levels.js';
import { goalSkill, goalNote, goalLine, progressWord } from '../goals.js';
import BackupNudge from '../components/BackupNudge.jsx';
import { sortSessions, prettyDate, sessionsUntilCheckIn, isOver } from '../sessions.js';
import { findThemes } from '../coach.js';
import { needsThemes, themeCounts, improvingAndWorking, gamesSummary } from '../patterns.js';
import RatingChart from '../components/RatingChart.jsx';
import { levelKnown } from '../modes.js';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function Home({ player, updatePlayer, onGo, mode = 'full' }) {
  const simple = mode !== 'full'; // A little reflection: no level, no skills picture, no check-ins
  const [selected, setSelected] = useState(null);
  // What keeps coming up in your notes: the coach groups them, the app counts them. Looks again every 5 games.
  const [busy, setBusy] = useState(false);
  const themes = mode === 'fun' ? [] : themeCounts(player);
  const refresh = () => {
    if (busy) return;
    setBusy(true);
    findThemes(player).then((patterns) => updatePlayer((p) => ({ ...p, patterns }))).catch(() => { /* offline: try again next time */ }).finally(() => setBusy(false));
  };
  const tried = useRef(false);
  useEffect(() => { if (!tried.current && needsThemes(player) && location.protocol !== 'file:') { tried.current = true; refresh(); } }, []);
  const upcomingAll = sortSessions(player.sessions).upcoming;
  // Logged after playing (or with a result) counts as played, not as the next session.
  const done = (x) => isOver(x);
  const planned = upcomingAll.find((x) => !done(x));
  const unreflected = upcomingAll.filter(done).slice(-1)[0];
  const next = planned
    ? {
        when: prettyDate(planned.date, planned.time),
        who: planned.kind === 'lesson' ? `Lesson${planned.coach ? ' with ' + planned.coach : ''}` : [planned.partner && `With ${planned.partner}`, planned.opponents?.filter(Boolean).length ? `vs ${planned.opponents.filter(Boolean).join(' & ')}` : ''].filter(Boolean).join(' ') || 'Match',
        venue: planned.venue,
        intention: planned.intention,
      }
    : player.nextSession
      ? { when: player.nextSession.when, who: `With ${player.nextSession.partner} vs ${player.nextSession.opponents.join(' & ')}`, venue: player.nextSession.venue }
      : null;
  const iw = improvingAndWorking(player);
  const gs = gamesSummary(player);
  const fresh = mode === 'full' && !player.quiz && !player.levelSetByPlayer && Object.keys(player.skillChecks || {}).length === 0;
  const axisLevels = currentAxisLevels(player);
  const axisScores = currentAxisScores(player);
  const levelId = currentLevel(player);
  const level = levels.find((l) => l.id === levelId)?.name ?? levelId;
  const selectedAxis = selected ? axisById[selected] : null;
  const selectedSkills = selected ? allSkills.filter((s) => s.axis === selected) : [];

  return (
    <>
      <main className="home">
        <header className="home-head">
          <div>
            <p className="hello">{greeting()}</p>
            <h1 className="name">{player.name || 'Player'}</h1>
          </div>
          <div className="avatar" aria-hidden="true">{(player.name || 'P')[0]}</div>
        </header>

        {fresh && (
          <section className="panel focus-card">
            <p className="eyebrow">Start here</p>
            <p className="insight">Tell us how you play today.</p>
            <p className="soft">A few quick taps on Skills, then everything else makes more sense.</p>
            <button className="btn" onClick={() => onGo('skills')}>Start with Skills</button>
          </section>
        )}

        {mode !== 'fun' && <RatingChart player={player} onOpen={() => onGo('matches')} />}

        {!simple && <section className="tiles" aria-label="Summary">
          <div className="panel tile">
            <p className="eyebrow">Your level</p>
            <p className={'tile-value' + (level.length > 2 ? ' small' : '')}>{level}</p>
            <p className="tile-note">{player.provisional ? 'Starting estimate' : 'Self-assessed'}</p>
          </div>
          <div className="panel tile">
            <p className="eyebrow">Active goals</p>
            <p className="tile-value">{(player.goals || []).length}</p>
            <p className="tile-note">Max 3 at a time</p>
          </div>
        </section>}

        {unreflected && (
          <section className="panel focus-card">
            <p className="eyebrow">Did you play?</p>
            <p className="insight">{prettyDate(unreflected.date, unreflected.time)}{unreflected.kind === 'lesson' ? ' · lesson' : ''}</p>
            <button className="btn" onClick={() => onGo('matches', { reflect: unreflected.id })}>Reflect now</button>
          </section>
        )}

        <BackupNudge player={player} updatePlayer={updatePlayer} onSettings={() => onGo('settings')} />

        {!simple && sessionsUntilCheckIn(player) === 0 && (
          <section className="panel center">
            <p className="insight">Check-in due</p>
            <p className="soft">A 2-minute re-check of a few skills, so your profile stays up to date.</p>
            <button className="btn" onClick={() => onGo('checkin')}>Start check-in</button>
          </section>
        )}

        {!simple && <section className="panel" aria-label="Your game">
          <p className="eyebrow">Your game</p>
          <Pentagon axes={axes} axisLevels={axisLevels} scores={axisScores} selected={selected} onSelect={setSelected} />
          {!selectedAxis && <p className="soft center">Tap an area to see its skills</p>}
        </section>}
        {!simple && selectedAxis && (
          <SkillBars
            title={selectedAxis.name}
            skills={selectedSkills.filter((s) => s.checked && !s.optional)}
            checks={skillChecks(player)}
            level={currentLevel(player)}
            note="Slide a bar to set where you are. Tap a skill name to open it."
            onOpen={(id) => onGo('skills', { open: id })}
            onSet={(s, v) => updatePlayer((p) => ({ ...p, skillChecks: { ...(p.skillChecks || {}), [s.id]: { ...v, mode: 'slider', date: new Date().toISOString() } } }))}
          />
        )}

        {mode !== 'fun' && gs.month + gs.lastMonth > 0 && (
          <section className="panel tappable" aria-label="Games this month" onClick={() => onGo('matches')}>
            <p className="eyebrow">Games this month</p>
            <div className="games-row">
              <p className="hero-big">{gs.month}</p>
              <svg className="weeks" viewBox="0 0 140 40" role="img" aria-label="Games per week over the last six weeks">
                {gs.weeks.map((c, i) => <rect key={i} x={2 + i * 24} y={40 - Math.min(c, 4) * 8 - (c ? 0 : -6)} width="16" height={c ? Math.min(c, 4) * 8 : 2} rx="4" className={i === 5 ? 'wk now' : 'wk'} />)}
              </svg>
            </div>
            <p className="soft">{gs.matches} {gs.matches === 1 ? 'match' : 'matches'}, {gs.lessons} {gs.lessons === 1 ? 'lesson' : 'lessons'} · {gs.lastMonth} last month</p>
          </section>
        )}

        <section className="panel tappable" aria-label="Current focus" onClick={(e) => { if (!e.target.closest('button')) onGo('goals'); }}>
          <p className="eyebrow">Current focus</p>
          <p className="soft">How each one is going</p>
          {(player.goals || []).length === 0 && <p className="soft empty">{simple ? 'Nothing picked yet. One thing to work on is plenty.' : "No focus yet. Soon you'll pick up to 3 things to work on."}</p>}
          <ul className="goals">
            {(player.goals || []).map((g) => {
              const skill = skillById[g.skillId];
              return (
                <li key={g.id} className="goal">
                  <div className="goal-top">
                    <span className="goal-title">{goalSkill(g)}</span>
                    <span className="goal-pct">{progressWord(g.progress)}</span>
                  </div>
                  {goalNote(g) && <p className="goal-note">{goalNote(g)}</p>}
                  <div className="bar" role="progressbar" aria-valuenow={g.progress} aria-valuemin="0" aria-valuemax="100" aria-label={goalLine(g)}>
                    <span style={{ width: g.progress + '%' }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <button className="linkish" onClick={() => onGo('goals')}>See all my goals ›</button>
        </section>

        <section className="panel" aria-label="Next session">
          <p className="eyebrow">Next session</p>
          {next ? (
            <>
              <p className="match-when">{next.when}</p>
              <p className="match-who">{next.who}</p>
              {next.venue && <p className="soft">{next.venue}</p>}
              {next.intention && <p className="soft">Focus: <em>{next.intention}</em></p>}
              <button className="btn" onClick={() => onGo('matches', planned ? { plan: planned.id } : null)}>{simple ? (next.intention ? 'Change your focus' : 'Set your focus') : 'Plan this session'}</button>
            </>
          ) : (
            <>
              <p className="soft empty">Nothing planned yet.</p>
              <button className="btn" onClick={() => onGo('matches')}>Add a game</button>
            </>
          )}
        </section>

        {mode !== 'fun' && (iw.improving || iw.working || busy) && (
          <section className="panel" aria-label="Your pattern">
            <p className="eyebrow">Your pattern</p>
            {!iw.improving && !iw.working ? <p className="soft">Reading your notes…</p> : (
              <div className="pattern-grid">
                <div className="pbox good">
                  <p className="eyebrow">Improving</p>
                  <p className="goal-title">{iw.improving ? (iw.improving.text || goalSkill((player.goals || []).find((g) => g.id === iw.improving.goalId))) : 'Keep going'}</p>
                  <p className="soft">{iw.improving ? iw.improving.note : 'It shows up as you play more'}</p>
                </div>
                <div className="pbox work">
                  <p className="eyebrow">Working on</p>
                  <p className="goal-title">{iw.working ? iw.working.text : 'Nothing yet'}</p>
                  <p className="soft">{iw.working ? iw.working.note : 'Add a note after a game'}</p>
                </div>
              </div>
            )}
            <p className="soft">From your own notes. <button className="linkish" onClick={refresh} disabled={busy}>{busy ? 'Updating…' : 'Refresh from my notes'}</button></p>
          </section>
        )}

        {!(themes.length > 0 && !player.insight) && !(simple && themes.length > 0) && <section className="panel" aria-label="Coach insight">
          <p className="eyebrow">Coach insight</p>
          {player.insight ? (
            <>
              <p className="insight">{player.insight.text}</p>
              <p className="soft">Based on: {player.insight.basedOn}</p>
            </>
          ) : (
            <p className="insight">{!levelKnown(player) ? "Log a few games, with a note on what to work on, and I'll start spotting patterns." : player.provisional ? "Your level is a starting estimate. Play a few sessions and I'll start spotting patterns." : "Keep logging your sessions. I'll start spotting patterns once the coach is connected."}</p>
          )}
        </section>}
      </main>
    </>
  );
}

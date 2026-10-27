import React, { useState } from 'react';
import Pentagon from '../components/Pentagon.jsx';
import SkillBars from '../components/SkillBars.jsx';
import { axes, axisById, levels, allSkills, allSkillById as skillById } from '../data.js';
import { currentAxisLevels, currentAxisScores, currentLevel, skillChecks } from '../levels.js';
import { goalSkill, goalNote, goalLine } from '../goals.js';
import { sortSessions, prettyDate, sessionsUntilCheckIn, todayISO } from '../sessions.js';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function Home({ player, updatePlayer, onGo }) {
  const [selected, setSelected] = useState(null);
  const upcomingAll = sortSessions(player.sessions).upcoming;
  // Logged after playing (or with a result) counts as played, not as the next session.
  const done = (x) => x.date < todayISO() || x.logged || !!x.result;
  const planned = upcomingAll.find((x) => !done(x));
  const unreflected = upcomingAll.filter(done).slice(-1)[0];
  const next = planned
    ? {
        when: prettyDate(planned.date, planned.time),
        who: planned.kind === 'lesson' ? `Lesson${planned.coach ? ' with ' + planned.coach : ''}` : [planned.partner && `With ${planned.partner}`, planned.opponents?.filter(Boolean).length ? `vs ${planned.opponents.filter(Boolean).join(' & ')}` : ''].filter(Boolean).join(' ') || 'Match',
        venue: planned.venue,
      }
    : player.nextSession
      ? { when: player.nextSession.when, who: `With ${player.nextSession.partner} vs ${player.nextSession.opponents.join(' & ')}`, venue: player.nextSession.venue }
      : null;
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

        <section className="tiles" aria-label="Summary">
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
        </section>

        {unreflected && (
          <section className="panel focus-card">
            <p className="eyebrow">Did you play?</p>
            <p className="insight">{prettyDate(unreflected.date, unreflected.time)}{unreflected.kind === 'lesson' ? ' · lesson' : ''}</p>
            <button className="btn" onClick={() => onGo('matches', { reflect: unreflected.id })}>Reflect now</button>
          </section>
        )}

        {sessionsUntilCheckIn(player) === 0 && (
          <section className="panel center">
            <p className="insight">Check-in due</p>
            <button className="btn" onClick={() => onGo('checkin')}>Start check-in</button>
          </section>
        )}

        <section className="panel" aria-label="Your game">
          <p className="eyebrow">Your game</p>
          <Pentagon axes={axes} axisLevels={axisLevels} scores={axisScores} selected={selected} onSelect={setSelected} />
          {!selectedAxis && <p className="soft center">Tap an area to see its skills</p>}
        </section>
        {selectedAxis && (
          <SkillBars
            title={selectedAxis.name}
            skills={selectedSkills.filter((s) => s.checked && !s.optional)}
            checks={skillChecks(player)}
            level={currentLevel(player)}
            note="Tap a skill to open it, or Adjust to move the bars yourself."
            onOpen={(id) => onGo('skills', { open: id })}
            onSet={(s, v) => updatePlayer((p) => ({ ...p, skillChecks: { ...(p.skillChecks || {}), [s.id]: { ...v, mode: 'slider', date: new Date().toISOString() } } }))}
          />
        )}

        <section className="panel" aria-label="Current focus">
          <p className="eyebrow">Current focus</p>
          <p className="soft">How happy you are with each goal</p>
          {(player.goals || []).length === 0 && <p className="soft empty">No focus yet. Soon you'll pick up to 3 things to work on.</p>}
          <ul className="goals">
            {(player.goals || []).map((g) => {
              const skill = skillById[g.skillId];
              return (
                <li key={g.id} className="goal">
                  <div className="goal-top">
                    <span className="goal-title">{goalSkill(g)}</span>
                    <span className="goal-pct">{g.progress}%</span>
                  </div>
                  {goalNote(g) && <p className="goal-note">{goalNote(g)}</p>}
                  <div className="bar" role="progressbar" aria-valuenow={g.progress} aria-valuemin="0" aria-valuemax="100" aria-label={goalLine(g)}>
                    <span style={{ width: g.progress + '%' }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="panel" aria-label="Next session">
          <p className="eyebrow">Next session</p>
          {next ? (
            <>
              <p className="match-when">{next.when}</p>
              <p className="match-who">{next.who}</p>
              {next.venue && <p className="soft">{next.venue}</p>}
              <button className="btn" onClick={() => onGo('matches', planned ? { plan: planned.id } : null)}>Plan this session</button>
            </>
          ) : (
            <>
              <p className="soft empty">Nothing planned yet.</p>
              <button className="btn" onClick={() => onGo('matches')}>Add a match or lesson</button>
            </>
          )}
        </section>

        <section className="panel" aria-label="Coach insight">
          <p className="eyebrow">Coach insight</p>
          {player.insight ? (
            <>
              <p className="insight">{player.insight.text}</p>
              <p className="soft">Based on: {player.insight.basedOn}</p>
            </>
          ) : (
            <p className="insight">{player.provisional ? "Your level is a starting estimate. Play a few sessions and I'll start spotting patterns." : "Keep logging your sessions. I'll start spotting patterns once the coach is connected."}</p>
          )}
        </section>
      </main>
    </>
  );
}

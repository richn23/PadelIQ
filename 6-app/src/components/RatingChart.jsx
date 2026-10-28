import React from 'react';
import { playedGames } from '../patterns.js';
import { ratingOf, ratingLabel } from '../rating.js';

const W = 326, H = 150, TOP = 24, BOT = 124, PAD = 12;
const SAMPLE = [6, 7, 5, 6, 8, 7, 4, 7, 8, 7];
const y = (v) => BOT - (v / 10) * (BOT - TOP);

// "Usually 6 to 7": the middle half of the rated games, so one odd game does not move it.
export function usualRange(values) {
  if (values.length < 3) return null;
  const s = [...values].sort((a, b) => a - b);
  const at = (q) => s[Math.round(q * (s.length - 1))];
  const lo = at(0.25), hi = at(0.75);
  return lo === hi ? `Usually ${lo}` : `Usually ${lo} to ${hi}`;
}

// The last 10 games, you against your own best. Unrated games leave a gap. No streaks, no arrows.
export default function RatingChart({ player, onOpen }) {
  const games = playedGames(player).slice(-10);
  const pts = games.map((g, i) => ({ i, r: ratingOf(g) }));
  const rated = pts.filter((p) => p.r);
  const n = Math.max(games.length, 2);
  const x = (i) => PAD + (i * (W - 2 * PAD)) / (n - 1);
  const range = usualRange(rated.map((p) => p.r.value));
  const last = rated[rated.length - 1];
  // break the line wherever a game has no rating
  const runs = [];
  pts.forEach((p) => { if (!p.r) { runs.push(null); return; } const cur = runs[runs.length - 1]; if (cur) cur.push(p); else runs.push([p]); });
  const lines = runs.filter((r) => r && r.length > 1);

  return (
    <section className="panel hero" aria-label="How you played" onClick={onOpen}>
      <p className="eyebrow">Compared with your best</p>
      {range ? (
        <>
          <p className="hero-big">{range}</p>
          <p className="soft">Last {games.length} games</p>
          <svg className="hero-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Your last ${games.length} games compared with your own best. ${range}.`}>
            <line x1="0" y1={y(10)} x2={W} y2={y(10)} className="guide" />
            <line x1="0" y1={y(0)} x2={W} y2={y(0)} className="guide" />
            <text x="0" y="14" className="gtext">My best</text>
            <text x="0" y="141" className="gtext">Off day</text>
            {lines.map((r, k) => <polyline key={k} className="hline" points={r.map((p) => `${x(p.i)},${y(p.r.value)}`).join(' ')} />)}
            {rated.map((p) => <circle key={p.i} cx={x(p.i)} cy={y(p.r.value)} r={p === last ? 6 : 4.5} className={'hdot' + (p.r.estimated ? ' est' : '') + (p === last ? ' last' : '')} />)}
          </svg>
          {last && <p className="soft">Last game: <b>{last.r.value}</b>, {ratingLabel(last.r.value).toLowerCase()}{last.r.estimated ? ' (estimated)' : ''}</p>}
        </>
      ) : (
        <>
          <p className="hero-big small">Rate a few games and your chart will appear here.</p>
          <svg className="hero-chart ghost" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Example of the chart you will see after rating a few games">
            <line x1="0" y1={y(10)} x2={W} y2={y(10)} className="guide" />
            <line x1="0" y1={y(0)} x2={W} y2={y(0)} className="guide" />
            <text x="0" y="14" className="gtext">My best</text>
            <text x="0" y="141" className="gtext">Off day</text>
            <polyline className="hline" points={SAMPLE.map((v, i) => `${PAD + (i * (W - 2 * PAD)) / (SAMPLE.length - 1)},${y(v)}`).join(' ')} />
            {SAMPLE.map((v, i) => <circle key={i} cx={PAD + (i * (W - 2 * PAD)) / (SAMPLE.length - 1)} cy={y(v)} r="4.5" className="hdot" />)}
          </svg>
          <p className="soft">An example. After each game you will be asked how you played compared with your own best, 0 to 10. It is only ever you against you.</p>
        </>
      )}
    </section>
  );
}

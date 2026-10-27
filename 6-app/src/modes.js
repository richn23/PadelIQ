import { axes } from './data.js';

// Three ways to use Padel IQ. Chosen on the first screen, changeable in Settings.
// Players from before this existed have no mode saved, so they stay on the full picture.
export const MODES = [
  { id: 'fun', name: 'Just for fun', text: 'Log your games: who you played with and the score. No thinking needed.' },
  { id: 'reflect', name: 'A little reflection', text: 'Log your games, how they felt, and pick one thing to work on.', recommended: true },
  { id: 'full', name: 'The full picture', text: 'Check your skills, set goals, plan games and reflect. The coach helps with all of it.' },
];
export const modeOf = (player) => player?.mode || 'full';

// A new player who skipped the skills check. Nothing here is shown as a level.
export function starterPlayer(name, mode) {
  return {
    name: name || 'Player',
    mode,
    provisional: true,
    level: 'C',
    levelSetByPlayer: false,
    axisLevels: Object.fromEntries(axes.map((a) => [a.id, 'C'])),
    about: {},
    extra: {},
    answers: {},
    quizChecks: {},
    quiz: null,
    goals: [],
    sessions: [],
    skillChecks: {},
    nextSession: null,
    insight: null,
    createdAt: new Date().toISOString(),
  };
}

// A light fun fact: your record with the partner you've played most (needs 2+ results with them).
export function funFact(sessions = []) {
  const by = {};
  sessions.forEach((s) => {
    const o = s.result?.outcome;
    const who = s.partner?.trim();
    if (s.kind !== 'match' || !who || (o !== 'won' && o !== 'lost')) return;
    const k = who.toLowerCase();
    by[k] = by[k] || { name: who, w: 0, l: 0 };
    by[k][o === 'won' ? 'w' : 'l'] += 1;
  });
  const best = Object.values(by).filter((x) => x.w + x.l >= 2).sort((a, b) => b.w + b.l - (a.w + a.l))[0];
  return best ? `Your record with ${best.name}: ${best.w}–${best.l}` : null;
}

// Has this player told us their level? Fun and reflection players who skipped the skills check haven't:
// the app stores a placeholder for them, which must never be shown or coached as a real level.
export const levelKnown = (player) => modeOf(player) === 'full' || !!player?.quiz || !!player?.levelSetByPlayer || Object.keys(player?.skillChecks || {}).length > 0;

// Whether to show a level label on the Skills screen: only when the player really gave one (not just rated a skill or two).
export const levelShown = (player) => modeOf(player) === 'full' || !!player?.quiz || !!player?.levelSetByPlayer;

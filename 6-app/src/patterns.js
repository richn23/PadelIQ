// What keeps coming up in the player's own one-line notes, and what has gone quiet.
// The coach only decides which notes are about the same thing. The app does all the counting,
// so no number is ever made up.
import { modeOf } from './modes.js';

export const playedGames = (player) => (player.sessions || [])
  .filter((s) => s.status === 'played')
  .sort((a, b) => a.date.localeCompare(b.date) || (a.playedAt || '').localeCompare(b.playedAt || ''));
export const noteOf = (s) => (s.notes?.tryNext || s.note || '').trim();

// Time to look for themes? From 5 games (3 with a note), then again every 5 games.
export function needsThemes(player) {
  if (modeOf(player) === 'fun') return false;
  const games = playedGames(player);
  if (games.length < 5 || games.filter(noteOf).length < 3) return false;
  return !player.patterns || games.length >= (player.patterns.at || 0) + 5;
}

// Counted from the saved themes: [{ label, count, total, last, quiet }] biggest first.
export function themeCounts(player) {
  const games = playedGames(player);
  const numberOf = Object.fromEntries(games.map((s, i) => [s.id, i + 1]));
  return (player.patterns?.themes || [])
    .map((t) => {
      const nums = t.ids.map((id) => numberOf[id]).filter(Boolean).sort((a, b) => a - b);
      return { label: t.label, count: nums.length, total: games.length, last: nums[nums.length - 1] || 0, quiet: games.length - (nums[nums.length - 1] || 0) };
    })
    .filter((t) => t.count >= 2)
    .sort((a, b) => b.count - a.count);
}

// "Backhand volley: 7 of 25 games" and, if it has stopped, "not mentioned since game 13".
export const patternLine = (t) => `${t.label}: ${t.count} of ${t.total} games${t.quiet >= 5 ? `, not mentioned since game ${t.last}` : ''}`;

// Improving / Working on, from the player's own words only (no new guesses).
// Improving: something that used to come up a lot in notes and has gone quiet, else the goal furthest along.
// Working on: what keeps coming up in notes lately, else the newest "one thing to work on".
export function improvingAndWorking(player) {
  const themes = themeCounts(player);
  const quiet = themes.find((t) => t.count >= 3 && t.quiet >= 5);
  const goals = [...(player.goals || [])].sort((a, b) => b.progress - a.progress);
  const best = goals.find((g) => g.progress >= 45);
  const active = themes.find((t) => t.quiet < 5);
  const lastTry = [...playedGames(player)].reverse().map(noteOf).find(Boolean);
  return {
    improving: quiet
      ? { text: quiet.label, note: `Not in your notes since game ${quiet.last}` }
      : best ? { goalId: best.id, note: 'One of your goals, going well' } : null,
    working: active
      ? { text: active.label, note: `Came up in ${active.count} of ${active.total} games` }
      : lastTry ? { text: lastTry, note: 'From your last game' } : null,
    best,
  };
}

// Games per week for the last 6 weeks, and played this month / last month.
export function gamesSummary(player, now = new Date()) {
  const games = playedGames(player);
  const mk = (d) => d.getFullYear() * 12 + d.getMonth();
  const cur = mk(now);
  const inMonth = (m) => games.filter((s) => { const d = new Date(s.date + 'T00:00:00'); return mk(d) === m; });
  const weeks = Array.from({ length: 6 }, () => 0);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  games.forEach((s) => {
    const d = new Date(s.date + 'T00:00:00');
    const ago = Math.floor((startOfToday - d) / (7 * 86400000));
    if (ago >= 0 && ago < 6) weeks[5 - ago] += 1;
  });
  const m = inMonth(cur);
  return { month: m.length, matches: m.filter((s) => s.kind !== 'lesson').length, lessons: m.filter((s) => s.kind === 'lesson').length, lastMonth: inMonth(cur - 1).length, weeks };
}

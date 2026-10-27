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

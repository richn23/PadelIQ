import { playedGames } from './patterns.js';

// "How did you play compared with your own best?" 0 to 10. Always you against you,
// never about the opponents or the result.
export const BANDS = [
  { min: 0, max: 3, label: 'Well below my best' },
  { min: 4, max: 5, label: 'A bit below my usual' },
  { min: 6, max: 7, label: 'About my usual' },
  { min: 8, max: 9, label: 'Close to my best' },
  { min: 10, max: 10, label: 'My best ever' },
];

export const ratingLabel = (n) => BANDS.find((b) => n >= b.min && n <= b.max)?.label || '';

// Older games only have the four "how it felt" words. Give them a rough number, marked as an estimate.
const FEEL_TO_RATING = { great: 9, good: 7, mixed: 5, tough: 3 };

export function ratingOf(s) {
  if (!s) return null;
  if (Number.isFinite(s.rating)) return { value: s.rating, estimated: false };
  if (s.feel && FEEL_TO_RATING[s.feel] != null) return { value: FEEL_TO_RATING[s.feel], estimated: true };
  return null;
}

// A run of 3: three games in a row below (or above) your own usual, or a new personal high.
// Needs 6 real ratings so "usual" means something. Fires once, on the third game of the run.
// `extra` lets the chat see a game that is being reflected on but not saved yet.
export function runSignal(player, extra) {
  const sessions = (player?.sessions || []).filter((s) => !extra || s.id !== extra.id).concat(extra ? [{ ...extra, status: 'played' }] : []);
  const list = playedGames({ sessions }).filter((s) => Number.isFinite(s.rating));
  if (list.length < 6) return null;
  const base = list.slice(-13, -3).map((s) => s.rating).sort((a, b) => a - b);
  const q = (f) => base[Math.round(f * (base.length - 1))];
  const lo = q(0.25), hi = q(0.75);
  const last3 = list.slice(-3).map((s) => s.rating);
  const before = list.length >= 7 ? list[list.length - 4].rating : null;
  const id = list[list.length - 1].id;
  const usual = lo === hi ? `${lo}` : `${lo} to ${hi}`;
  if (last3.every((v) => v < lo) && !(before != null && before < lo)) return { type: 'dip', id, usual };
  if (last3.every((v) => v > hi) && !(before != null && before > hi)) return { type: 'good', id, usual };
  const top = last3[2];
  if (top >= 8 && top > base[base.length - 1] && !(last3[0] < lo && last3[1] < lo)) return { type: 'high', id, usual };
  return null;
}

export const signalOpener = (t) => ({
  dip: 'That is three below your usual in a row. It happens, and a busy stretch off the court can show up in your game. No need to explain. Is there anything on court that has felt different?',
  good: 'Three above your usual in a row, nice. What has been clicking?',
  high: 'That is your highest yet, nice one. What was working today?',
}[t]);

export const signalCard = (t) => ({
  dip: { title: 'A few tougher games lately', text: 'It happens. Life off the court can affect your game too. Want to talk about what has felt different on court?', cta: 'Talk it through' },
  good: { title: 'A good run', text: 'Three games above your usual in a row. Nice. Want to look at what has been working?', cta: "What's clicking" },
  high: { title: 'Your best yet', text: 'That was your highest rating so far. Want to look at what was working?', cta: 'Talk about it' },
}[t]);

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

import { BANDS, ratingLabel } from '../rating.js';

// 0 to 10 buttons with a plain label underneath. Tap the same number again to clear it.
export default function RatingPicker({ value, onChange, first }) {
  const has = Number.isFinite(value);
  return (
    <section className="panel rating">
      <p className="eyebrow">How did you play today, compared with your own best?</p>
      <p className="soft">This is about your game, not the result or how good they were. Playing stronger players? Rate what you did.</p>
      <div className="rating-row" role="group" aria-label="Rating from 0 to 10">
        {Array.from({ length: 11 }, (_, n) => (
          <button key={n} type="button" className={'rate' + (value === n ? ' on' : '')} aria-pressed={value === n} onClick={() => onChange(value === n ? null : n)}>{n}</button>
        ))}
      </div>
      <p className="rating-label" aria-live="polite">{has ? `${value}: ${ratingLabel(value)}` : 'Optional. Tap a number.'}</p>
      {!has && (
        <ul className="rating-key">
          {BANDS.map((b) => <li key={b.label}><b>{b.min === b.max ? b.min : `${b.min}-${b.max}`}</b> {b.label}</li>)}
        </ul>
      )}
      {first && !has && <p className="soft">For example: lost 6-1 to a much stronger pair, but your volleys were the best they have been? That is an 8.</p>}
    </section>
  );
}

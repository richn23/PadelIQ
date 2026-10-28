import { useState } from 'react';
import { BANDS, ratingLabel } from '../rating.js';

// Colour for each step, red through amber to green (calm, not alarming).
const colour = (n) => `hsl(${Math.round(8 + (n / 10) * 112)}, 78%, 56%)`;
const track = `linear-gradient(90deg, ${Array.from({ length: 11 }, (_, n) => colour(n)).join(', ')})`;

// A 0 to 10 slider you slide or tap. Nothing is set until you touch it. "i" explains the scale.
export default function RatingPicker({ value, onChange, first }) {
  const has = Number.isFinite(value);
  const [info, setInfo] = useState(false);
  const pick = (e) => onChange(Number(e.currentTarget.value));
  return (
    <section className="panel rating">
      <div className="row-between">
        <p className="eyebrow">How did you play, compared with your own best?</p>
        <button type="button" className="info-btn" aria-label="What do the numbers mean?" aria-expanded={info} onClick={() => setInfo(!info)}>i</button>
      </div>
      <p className="soft">About your game, not the result or how good they were.</p>
      {info && (
        <div className="popover" role="dialog" aria-label="What the numbers mean">
          <ul className="rating-key">
            {BANDS.map((b) => <li key={b.label}><b>{b.min === b.max ? b.min : `${b.min}-${b.max}`}</b> {b.label}</li>)}
          </ul>
          <p className="soft">Playing stronger players? Rate what you did. For example: lost 6-1 to a much stronger pair, but your volleys were the best they have been? That is an 8.</p>
          {first && <p className="soft">It is only ever you against you.</p>}
          <button type="button" className="mini" onClick={() => setInfo(false)}>Got it</button>
        </div>
      )}
      <div className="rate-slider">
        <input
          type="range" min="0" max="10" step="1"
          value={has ? value : 5}
          className={has ? '' : 'unset'}
          style={{ background: track }}
          aria-label="Rating from 0 to 10"
          aria-valuetext={has ? `${value}, ${ratingLabel(value)}` : 'not rated'}
          onChange={pick}
          onPointerUp={pick}
          onClick={pick}
        />
        <div className="rate-ticks" aria-hidden="true">{Array.from({ length: 11 }, (_, n) => <span key={n}>{n}</span>)}</div>
      </div>
      <p className="rating-label" style={has ? { color: colour(value) } : undefined} aria-live="polite">
        {has ? `${value}: ${ratingLabel(value)}` : 'Optional. Slide or tap to rate.'}
      </p>
      {has && <button type="button" className="linkish" onClick={() => onChange(null)}>Clear</button>}
    </section>
  );
}

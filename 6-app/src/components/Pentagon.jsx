import React from 'react';
import { levels } from '../data.js';
import { levelFraction } from '../levels.js';

const W = 360;
const H = 336;
const CX = W / 2;
const CY = 170;
const R = 104; // radius of the outer ring (Pro)

const angle = (i, n) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
const point = (i, n, frac) => [CX + R * frac * Math.cos(angle(i, n)), CY + R * frac * Math.sin(angle(i, n))];
const toPoints = (pts) => pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');

// Short names for the corners ("Tactics and teamwork" becomes "Tactics")
const shortName = (axis) => axis.name.split(' and ')[0];

export default function Pentagon({ axes, axisLevels, selected, onSelect }) {
  const n = axes.length;
  const rings = levels.map((_, k) => toPoints(axes.map((_, i) => point(i, n, (k + 1) / levels.length))));
  const shape = axes.map((a, i) => point(i, n, levelFraction(axisLevels[a.id])));

  const summary = axes.map((a) => `${a.name} ${axisLevels[a.id]}`).join(', ');

  return (
    <svg className="pentagon" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Your game: ${summary}`}>
      {rings.map((pts, k) => (
        <polygon key={k} points={pts} fill="none" stroke="var(--chalk)" strokeOpacity={k === rings.length - 1 ? 0.55 : 0.22} strokeWidth="1" />
      ))}
      {axes.map((a, i) => {
        const [x, y] = point(i, n, 1);
        return <line key={a.id} x1={CX} y1={CY} x2={x} y2={y} stroke="var(--chalk)" strokeOpacity="0.22" />;
      })}

      <polygon points={toPoints(shape)} fill="var(--pent-fill)" stroke="var(--pent-line)" strokeWidth="2.5" strokeLinejoin="round" />
      {shape.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill="var(--pent-line)" />
      ))}

      {axes.map((a, i) => {
        const cos = Math.cos(angle(i, n));
        const sin = Math.sin(angle(i, n));
        const lx = CX + (R + 20) * cos;
        const ly = CY + (R + 20) * sin;
        const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
        const top = sin < -0.9;
        const y1 = top ? ly - 20 : ly;
        const isSel = selected === a.id;
        return (
          <g
            key={a.id}
            className={'pent-axis' + (isSel ? ' is-selected' : '')}
            role="button"
            tabIndex={0}
            aria-label={`${a.name}, level ${axisLevels[a.id]}`}
            onClick={() => onSelect(a.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(a.id)}
          >
            <rect x={anchor === 'start' ? lx - 6 : anchor === 'end' ? lx - 84 : lx - 45} y={y1 - 16} width="90" height="46" fill="transparent" />
            <text x={lx} y={y1} textAnchor={anchor} className="pent-name">{shortName(a)}</text>
            <text x={lx} y={y1 + 22} textAnchor={anchor} className="pent-level">{axisLevels[a.id]}</text>
          </g>
        );
      })}
    </svg>
  );
}

import { allSkillById } from './data.js';

// A goal shows the skill first (bold), and the player's own words second.
// Older goals may point to skills that have since been split (e.g. Volley -> forehand and backhand volley).
const LEGACY = { volley: 'Volley', groundstrokes: 'Forehand and backhand' };
export const goalSkill = (g) => allSkillById[g.skillId]?.name || LEGACY[g.skillId] || 'Goal';

// The player's own words, without old automatic titles like "Work on: Bandeja".
export const goalNote = (g) => {
  const t = (g.title || '').trim();
  if (!t || /^(work on:|improve my )/i.test(t)) return '';
  return t;
};

// One line, for small spaces: "Bandeja: faster and less loopy"
export const goalLine = (g) => {
  const n = goalNote(g);
  return n ? `${goalSkill(g)}: ${n[0].toLowerCase() + n.slice(1)}` : goalSkill(g);
};

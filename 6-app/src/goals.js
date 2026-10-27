import { allSkillById } from './data.js';

// A goal shows the skill first (bold), and the player's own words second.
// Older goals may point to skills that have since been split (e.g. Volley -> forehand and backhand volley).
const LEGACY = { volley: 'Volley', groundstrokes: 'Forehand and backhand' };
export const goalSkill = (g) => (g.own ? g.title || 'Goal' : allSkillById[g.skillId]?.name || LEGACY[g.skillId] || 'Goal');

// The player's own words, without old automatic titles like "Work on: Bandeja".
export const goalNote = (g) => {
  if (g.own) return ''; // a goal written in the player's own words has no separate note
  const t = (g.title || '').trim();
  if (!t || /^(work on:|improve my )/i.test(t)) return '';
  return t;
};

// One line, for small spaces: "Bandeja: faster and less loopy"
export const goalLine = (g) => {
  const n = goalNote(g);
  return n ? `${goalSkill(g)}: ${n[0].toLowerCase() + n.slice(1)}` : goalSkill(g);
};

// Goals the player has set aside live in player.parkedGoals, so everything else only ever sees active goals.
export const MAX_GOALS = 3;
export const addGoalTo = (p, g) => ({ ...p, goals: [...(p.goals || []), { id: 'g' + Date.now(), progress: 30, created: new Date().toISOString(), ...g }] });
export const parkGoalIn = (p, id) => {
  const g = (p.goals || []).find((x) => x.id === id);
  if (!g) return p;
  return { ...p, goals: p.goals.filter((x) => x.id !== id), parkedGoals: [...(p.parkedGoals || []), { ...g, parkedAt: new Date().toISOString() }] };
};
export const unparkGoalIn = (p, id) => {
  const g = (p.parkedGoals || []).find((x) => x.id === id);
  if (!g || (p.goals || []).length >= MAX_GOALS) return p;
  const { parkedAt, ...rest } = g; // eslint-disable-line no-unused-vars
  return { ...p, goals: [...(p.goals || []), rest], parkedGoals: p.parkedGoals.filter((x) => x.id !== id) };
};

export const progressWord = (n) => (n < 20 ? 'Just started' : n < 45 ? 'Getting going' : n < 70 ? 'Getting there' : n < 90 ? 'Nearly there' : 'Nailed it');
export const BACKUP_DAYS = 30;
export const backupDue = (p, now = Date.now()) => {
  if ((p.sessions || []).length < 3) return false;
  const day = 86400000;
  const last = p.lastBackup ? new Date(p.lastBackup).getTime() : 0;
  const snooze = p.backupSnooze ? new Date(p.backupSnooze).getTime() : 0;
  return now - last > BACKUP_DAYS * day && now - snooze > 14 * day;
};

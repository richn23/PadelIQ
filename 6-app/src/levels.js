import { levels, axes, allSkills, onboarding } from './data.js';

const byId = Object.fromEntries(levels.map((l) => [l.id.toLowerCase(), l]));
const find = (id) => (id ? byId[String(id).toLowerCase()] : undefined);

export const levelOrder = (id) => find(id)?.order ?? 0;
export const levelName = (id) => find(id)?.name ?? id;
export const levelByOrder = (o) => levels.find((l) => l.order === o);

// How far out on the pentagon a level sits (Beginner near the centre, Pro at the edge).
export const levelFraction = (id) => (levelOrder(id) + 1) / levels.length;

// DRAFT RULE: the overall level is where most axes sit (the middle one).
export function overallLevel(axisLevels) {
  const orders = Object.values(axisLevels).map(levelOrder).sort((a, b) => a - b);
  const mid = orders[Math.floor((orders.length - 1) / 2)];
  return levelByOrder(mid).id;
}

// Skill checks: your saved answers, plus quiz answers for skills you haven't checked yourself.
export function skillChecks(player) {
  const out = {};
  const answers = player.answers || {};
  onboarding.questions.forEach((q) => {
    if (typeof answers[q.id] === 'number') {
      const id = onboarding.answerLevels[Math.min(answers[q.id], onboarding.answerLevels.length - 2)];
      out[q.skill] = { level: id, from: 'quiz' };
    }
  });
  Object.entries(player.skillChecks || {}).forEach(([k, v]) => { out[k] = { ...v, from: 'you' }; });
  return out;
}

// DRAFT RULE: an area's level is the rounded average of its checked skills.
// No checked skills yet: keep the starting level from the quiz.
export function currentAxisLevels(player) {
  const checks = skillChecks(player);
  const result = {};
  axes.forEach((a) => {
    const orders = allSkills.filter((s) => s.axis === a.id && checks[s.id]).map((s) => levelOrder(checks[s.id].level));
    result[a.id] = orders.length
      ? levelByOrder(Math.floor(orders.reduce((x, y) => x + y, 0) / orders.length + 0.5)).id
      : player.axisLevels[a.id];
  });
  return result;
}

export function currentLevel(player) {
  return player.levelSetByPlayer ? player.level : overallLevel(currentAxisLevels(player));
}

// The level a skill asks for at a target level: the target, or the skill's top level if it stops earlier.
export function requiredFor(skill, targetId) {
  // Only "master" levels count: the ones a player at that level is expected to have.
  const have = Object.entries(skill.levels).filter(([, v]) => v.master).map(([k]) => levelOrder(k));
  if (!have.length) return null;
  const t = levelOrder(targetId);
  const ok = have.filter((o) => o <= t);
  return ok.length ? Math.max(...ok) : null;
}

// The first level where a skill is expected ("master"), as an order number.
export function firstMasterOrder(skill) {
  const m = Object.entries(skill.levels).filter(([, v]) => v.master).map(([k]) => levelOrder(k));
  return m.length ? Math.min(...m) : null;
}

// "Not yet": one level below where the skill is first expected (never below Beginner).
export function notYetLevel(skill) {
  const f = firstMasterOrder(skill);
  return levelByOrder(Math.max((f ?? 1) - 1, 0)).id;
}

// The highest level that has a description, for "same as" lines on the skill page.
export function topDescribed(skill) {
  const o = Object.keys(skill.levels).map(levelOrder);
  return o.length ? levelByOrder(Math.max(...o)).id : null;
}

// "a" or "an" before a level name ("an A player", "a B player")
export const article = (name) => (/^[AEFHILMNORSX]$/.test(name) || /^[aeiou]/i.test(name) ? 'an' : 'a');

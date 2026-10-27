import { levels, axes, allSkills, rules } from './data.js';

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

// Skill checks: your own checks, plus starting points from the quiz for skills you haven't checked yourself.
export function skillChecks(player) {
  const out = {};
  Object.entries(player.quizChecks || {}).forEach(([k, v]) => { out[k] = { ...v, from: 'quiz' }; });
  Object.entries(player.skillChecks || {}).forEach(([k, v]) => { out[k] = { ...v, from: 'you' }; });
  return out;
}

// DRAFT RULE: an area's level is the rounded average of its checked skills.
// No checked skills yet: keep the starting level from the quiz.
export function currentAxisLevels(player) {
  const checks = skillChecks(player);
  const result = {};
  axes.forEach((a) => {
    // Only skills you've checked yourself move an area. Quiz answers already set the starting areas.
    // Optional shots never count towards an area (having more of them mustn't raise it, missing them mustn't cap it).
    const orders = allSkills.filter((s) => s.axis === a.id && !s.optional && checks[s.id] && checks[s.id].from !== 'quiz').map((s) => levelOrder(checks[s.id].level));
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

// What the coach prioritises at a level (e.g. D: "Get it back.")
export const levelFocus = (id) => find(id)?.coachFocus || '';

// ---- Statement checks ("I can..." answered Always / Usually / Sometimes / Not yet) ----
// Rule (agreed with Richard): good enough = usually or always; mastered = always.
// You have a level when you're good enough at its statements AND have mastered every level below it.
export function scoreSkill(skill, answers = {}) {
  const r = rules.statementCheck;
  const byLevel = {};
  (skill.statements || []).forEach((st) => { (byLevel[st.level] = byLevel[st.level] || []).push(st); });
  const share = (list, ok) => {
    const answered = list.filter((st) => answers[st.id]);
    if (!answered.length) return 0;
    return list.filter((st) => ok.includes(answers[st.id])).length / list.length;
  };
  let level = null;
  for (const l of levels) {
    const list = byLevel[l.id];
    if (!list) continue;
    if (share(list, r.goodEnough) < r.share) break; // not good enough here: stop climbing
    level = l.id; // good enough (usually or always). "Always" only decides whether it's solid.
  }
  const result = level || notYetLevel(skill);
  const solid = level ? share(byLevel[level] || [], r.mastered) >= r.share : false;
  // What's missing for the next step up
  const nextOrder = levelOrder(result) + 1;
  const nextId = Object.keys(byLevel).map(levelOrder).filter((o) => o >= nextOrder).sort((a, b) => a - b)[0];
  const gaps = nextId === undefined ? [] : byLevel[levelByOrder(nextId).id].filter((st) => !r.goodEnough.includes(answers[st.id]));
  const notMastered = level ? (byLevel[level] || []).filter((st) => answers[st.id] !== 'always') : [];
  return { level: result, solid, gaps, nextLevel: nextId === undefined ? null : levelByOrder(nextId).id, notMastered };
}

// ---- Quick check: you say your level, the app confirms it with 4 questions ----
const levelsWithStatements = (skill) => [...new Set((skill.statements || []).map((st) => st.level))].sort((a, b) => levelOrder(a) - levelOrder(b));

export function quickQuestions(skill, claimed) {
  const have = levelsWithStatements(skill);
  if (!have.length) return { at: [], warning: null, stretch: null, used: claimed };
  // Use the claimed level, or the nearest level that has statements at or below it (else the first one).
  const below = have.filter((l) => levelOrder(l) <= levelOrder(claimed));
  const used = below.length ? below[below.length - 1] : null;
  const at = used ? skill.statements.filter((st) => st.level === used).slice(0, 2) : [];
  const ws = (skill.warnings || []).filter((w) => levelOrder(w.level) <= levelOrder(claimed));
  const warning = ws.length ? ws[ws.length - 1] : null;
  const nextLevel = have.find((l) => levelOrder(l) > levelOrder(used || claimed));
  const stretch = nextLevel ? skill.statements.find((st) => st.level === nextLevel) : null;
  return { at, warning, stretch, used };
}

export function quickScore(skill, claimed, q, ans) {
  const good = ['always', 'usually'];
  const atGood = q.at.filter((st) => good.includes(ans[st.id])).length;
  const atWeak = q.at.filter((st) => ans[st.id] && !good.includes(ans[st.id]));
  const w = q.warning ? ans[q.warning.id] : null;
  // Most warning questions are bad when 'Often'. A few are worded the other way round (invert).
  const warnOften = q.warning?.invert ? (w === 'never' || w === 'rarely') : w === 'often';
  const warnSome = w === 'sometimes';
  const stretchGood = q.stretch && good.includes(ans[q.stretch.id]);
  const lower = levelByOrder(Math.max(levelOrder(claimed) - 1, 0)).id;
  let outcome;
  if (q.at.length && (atGood === 0 || warnOften)) outcome = 'lower';
  else if (atWeak.length || warnSome) outcome = 'not_solid';
  else if (stretchGood) outcome = 'solid_close';
  else outcome = 'solid';
  // The point to work on: the weak thing at your level first, then the warning, then the stretch.
  const focus = [
    ...atWeak.map((st) => asGoal(st.text)),
    ...(warnOften || warnSome ? [q.warning.fix || q.warning.text] : []),
    ...(outcome === 'solid' && q.stretch ? [asGoal(q.stretch.text)] : []),
    // Solid and close to the next level: the next thing from that level you weren't asked about.
    ...(outcome === 'solid_close' && q.stretch
      ? skill.statements.filter((st) => st.level === q.stretch.level && st.id !== q.stretch.id).slice(0, 1).map((st) => asGoal(st.text))
      : []),
  ];
  return { outcome, level: outcome === 'lower' ? lower : claimed, suggested: outcome === 'lower' ? lower : claimed, focus };
}

// Turn a warning question ("Do you double fault in most games?") into a goal ("Fewer double faults")
export const focusToGoal = (text) => text.replace(/^Do (you|your) /i, '').replace(/^Does (your|the) /i, 'My ').replace(/^Are you /i, 'Not ').replace(/\?$/, '');

// "I can slice it so it stays low off the glass." -> "Slice it so it stays low off the glass"
export const asGoal = (text) => {
  let t = text.replace(/\.$/, '').replace(/^I can /, '').replace(/^I /, '').replace(/^My /, 'My ');
  return t[0].toUpperCase() + t.slice(1);
};

// If you pick your own overall level, every area moves by the same amount.
export function shiftAreas(axisLevels, chosen) {
  const diff = levelOrder(chosen) - levelOrder(overallLevel(axisLevels));
  return Object.fromEntries(Object.entries(axisLevels).map(([k, v]) => [k, levelByOrder(Math.min(Math.max(levelOrder(v) + diff, 0), 4)).id]));
}

// ---- Jagged profile: a score per area, with + and − inside a level ----
// A score is a level number with a fraction: 2 = C, 2.3 = C+, 1.7 = C−.
export function scoreLabel(score) {
  const top = levels.length - 1;
  const base = Math.min(Math.max(Math.round(score), 0), top);
  const d = score - base;
  return levelName(levelByOrder(base).id) + (d >= 0.2 && base < top ? '+' : d <= -0.2 && base > 0 ? '−' : '');
}

// One skill's score. Solid at a level = +0.3, getting there / not solid = −0.3.
// A skill whose descriptions stop below your level (e.g. rules) counts as at your level once you have its top.
export function skillScore(skill, check, levelId) {
  const base = levelOrder(check.level);
  if (typeof check.adj === 'number') return base + 0.3 * check.adj; // set on a slider: C−, C or C+
  const good = check.answer === 'yes' || check.solid || check.outcome === 'solid' || check.outcome === 'solid_close';
  const weak = check.partial || check.answer === 'getting_there' || check.outcome === 'not_solid';
  let s = base + (good ? 0.3 : weak ? -0.3 : 0);
  const tops = Object.entries(skill.levels || {}).filter(([, v]) => v.master).map(([k]) => levelOrder(k));
  if (tops.length && base >= Math.max(...tops) && !weak) s = Math.max(s, levelOrder(levelId) + 0.3);
  return s;
}

// Area scores from all skill answers (quiz and your own checks). Optional shots never count.
export function areaScores(checks, levelId, fallback = {}) {
  const out = {};
  axes.forEach((a) => {
    const list = allSkills.filter((s) => s.axis === a.id && !s.optional && checks[s.id]).map((s) => skillScore(s, checks[s.id], levelId));
    out[a.id] = list.length ? list.reduce((x, y) => x + y, 0) / list.length : levelOrder(fallback[a.id] || levelId);
  });
  return out;
}

export const currentAxisScores = (player) => areaScores(skillChecks(player), currentLevel(player), currentAxisLevels(player));

// The label for one skill's answer, e.g. "C", "C+" or "C−".
export const checkLabel = (skill, check, levelId) => scoreLabel(Math.min(skillScore(skill, check, levelId), levelOrder(check.level) + 0.3));

// One place where the app reads its data files (they live in ../5-data).
import themeFile from '../../5-data/themes.json';
import framework from '../../5-data/framework.json';
import glossary from '../../5-data/skills-glossary.json';
import player from '../../5-data/sample-player.json';
export { default as onboarding } from '../../5-data/onboarding.json';

export const themes = themeFile.themes;
export const defaultTheme = themeFile.defaultTheme;
export const axes = framework.axes;
export const levels = framework.levels;
export const skills = framework.skills;
export const rules = framework.rules;
export { player };

export const axisById = Object.fromEntries(axes.map((a) => [a.id, a]));
export const skillById = Object.fromEntries(skills.map((s) => [s.id, s]));

// Skills and shots: glossary words + level descriptions from the framework.
export const groups = glossary.groups;
// Skills that only make sense for beginners (e.g. the rules). Only the Beginner level is kept, and they are hidden for everyone above it.
export const BEGINNER_ONLY = new Set(['rules_scoring']);
const onlyBeginner = (id, obj) => (BEGINNER_ONLY.has(id) ? Object.fromEntries(Object.entries(obj).filter(([k]) => k === 'beginner')) : obj);
export const allSkills = glossary.items.map((g) => ({
  ...g,
  axis: g.area,
  levels: onlyBeginner(g.id, skillById[g.id]?.levels || {}),
  statements: (skillById[g.id]?.statements || []).filter((st) => !BEGINNER_ONLY.has(g.id) || st.level === 'beginner'),
  warnings: skillById[g.id]?.warnings || [],
  optional: g.optional ?? skillById[g.id]?.optional ?? false,
}));
export const allSkillById = Object.fromEntries(allSkills.map((s) => [s.id, s]));
import goalDiagnosis from '../../5-data/goal-diagnosis.json';
export { goalDiagnosis };

// The goal conversation's options for a skill: its own shot type first, else its group.
const typeOf = Object.fromEntries(Object.values(goalDiagnosis.skillTypes || {}).flatMap((t) => t.skills.map((id) => [id, t])));
const NON_SHOT = ['movement', 'tactics', 'mentality'];
export function goalOptions(skill) {
  const t = typeOf[skill.id];
  const gd = goalDiagnosis;
  return {
    problems: (t ? t.problems : gd.problemsByGroup[skill.group] || gd.problemsByGroup.attacking).filter((p) => !p.only || p.only.includes(skill.id)),
    when: t ? t.when : NON_SHOT.includes(skill.group) ? gd.whenNonShot : gd.when,
  };
}
// The label for a saved "when" answer, from any list.
export function whenLabel(skill, id) {
  const all = [...goalOptions(skill).when, ...goalDiagnosis.when, ...goalDiagnosis.whenNonShot];
  return all.find((w) => w.id === id)?.label;
}

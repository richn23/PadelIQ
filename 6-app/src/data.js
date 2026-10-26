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
export const allSkills = glossary.items.map((g) => ({
  ...g,
  axis: g.area,
  levels: skillById[g.id]?.levels || {},
  statements: skillById[g.id]?.statements || [],
  warnings: skillById[g.id]?.warnings || [],
  optional: g.optional ?? skillById[g.id]?.optional ?? false,
}));
export const allSkillById = Object.fromEntries(allSkills.map((s) => [s.id, s]));
export { default as goalDiagnosis } from '../../5-data/goal-diagnosis.json';

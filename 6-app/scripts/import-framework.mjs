// Turns the framework spreadsheet into the files the app reads.
//   In:  2-framework/framework-v3/padel-iq-skills.csv   (edit this one, e.g. in Excel)
//        5-data/warning-fixes.json                       (goal wording for warning questions)
//   Out: 5-data/framework.json (skills, levels, statements, warnings)
//        5-data/skills-glossary.json (names, groups, what/when)
// Run from 6-app:  npm run import-framework
import fs from 'node:fs';

const ROOT = new URL('../../', import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, ROOT), 'utf8').replace(/^﻿/, '');

// Small CSV reader: handles quotes, commas and line breaks inside cells.
function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((x) => x.trim()));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] || '').trim()])));
}

// App ids. Names not listed here get an id made from the name.
const IDS = {
  'Serve': 'serve', 'Second serve': 'second_serve', 'Forehand volley': 'volley_forehand', 'Backhand volley': 'volley_backhand',
  'Block volley': 'block_volley', 'Drop volley': 'drop_volley', 'Basic overhead': 'overhead_basic', 'Bandeja': 'bandeja',
  'Víbora': 'vibora', 'Smash': 'smash', 'Hook': 'gancho', 'Topspin smash': 'rulo', 'Smash out the side (x3)': 'smash_x3',
  'Smash out the back (x4)': 'smash_x4', 'Bajada': 'bajada', 'Drop shot': 'drop_shot', 'Return of serve': 'return_of_serve',
  'Forehand groundstroke': 'groundstroke_forehand', 'Backhand groundstroke': 'groundstroke_backhand', 'Defensive lob': 'defensive_lob',
  'Back glass return': 'back_glass_return', 'Side glass return': 'side_glass_return', 'Double glass': 'double_glass',
  'Back wall rescue': 'contrapared', 'Defending a smash': 'smash_defence', 'Chiquita': 'chiquita', 'Attacking lob': 'attacking_lob',
  'Passing shot': 'passing_shot', 'Half volley': 'half_volley', 'Between the legs': 'tweener', 'Behind the back': 'behind_back',
  'Playing outside the court': 'out_of_court', 'Fence rebound': 'fence_rebound', 'Knowing where to stand': 'positioning',
  'Ready position and split step': 'ready_position', 'Taking and holding the net': 'net_play', 'Recovery': 'recovery',
  'Moving as a pair': 'moving_as_pair', 'Shot choice': 'shot_choice', 'Talking to your partner': 'partner_communication',
  'Building points': 'building_points', 'Middle ball responsibility': 'middle_ball', 'Rules and scoring': 'rules_scoring',
  'Composure': 'composure', 'Bouncing back': 'bouncing_back', 'Focus': 'focus',
  // Friendlier names used in the app (the old name stays in "Also called")
  'Forehand': 'groundstroke_forehand', 'Backhand': 'groundstroke_backhand', 'The middle ball': 'middle_ball',
};
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const AREA = { 'Attack': 'attack', 'Defence': 'defence', 'Movement': 'movement', 'Tactics and teamwork': 'tactics', 'Mentality': 'mentality' };
// The spreadsheet uses a few category spellings; the app groups them like this.
const GROUP = {
  'Attacking shots': 'attacking', 'Attack': 'attacking', 'Defensive shots': 'defensive', 'Defence': 'defensive',
  'Transition shots': 'transition', 'Specialist shots': 'specialist', 'Movement': 'movement',
  'Tactics and teamwork': 'tactics', 'Mentality': 'mentality',
};
const ORDER = ['Beginner', 'D', 'C', 'B', 'A'];
const LEVEL_ID = { Beginner: 'beginner', D: 'D', C: 'C', B: 'B', A: 'A' };
const lines = (t) => t.split('\n').map((x) => x.trim()).filter(Boolean);

const rows = parseCSV(read('2-framework/framework-v3/padel-iq-skills.csv'));
const fixes = JSON.parse(read('5-data/warning-fixes.json'));
const framework = JSON.parse(read('5-data/framework.json'));
const glossary = JSON.parse(read('5-data/skills-glossary.json'));

const first0 = (rs) => rs[0];
const bySkill = new Map();
rows.forEach((r) => { if (!bySkill.has(r.Skill)) bySkill.set(r.Skill, []); bySkill.get(r.Skill).push(r); });

const skills = [];
const items = [];
const missingFix = new Set();
for (const [name, rs] of bySkill) {
  const id = first0(rs)['App ID'] || IDS[name] || slug(name);
  const first = rs[0];
  const area = AREA[first.Area];
  if (!area) throw new Error(`Unknown area "${first.Area}" for ${name}`);
  // A skill is "specialist" if any row says so and none is a normal shot category; else use the first non-specialist category.
  const cats = rs.map((r) => GROUP[r.Category] || 'attacking');
  const group = cats.find((c) => c !== 'specialist') || 'specialist';
  const leveled = rs.filter((r) => LEVEL_ID[r.Level]).sort((a, b) => ORDER.indexOf(a.Level) - ORDER.indexOf(b.Level));
  const optionalSkill = rs.every((r) => r.Optional === 'Yes');
  const levels = {};
  const statements = [];
  const warnings = [];
  leveled.forEach((r) => {
    const L = LEVEL_ID[r.Level];
    const master = r['Expected at this level'] === 'Yes' && r.Optional !== 'Yes';
    levels[L] = { master, optional: r.Optional === 'Yes', source: 'v3', recordId: r['Record ID'], text: r['What it looks like'] };
    lines(r['Statements (I can...)']).forEach((t, n) => statements.push({ id: `${r['Record ID']}_s${n + 1}`, level: L, text: t, optional: r.Optional === 'Yes', source: 'v3' }));
    lines(r['Warning questions']).forEach((t) => {
      if (warnings.some((w) => w.text === t)) return; // the same question at several levels: keep the lowest
      const f = fixes[t];
      if (!f) missingFix.add(t);
      warnings.push({ id: `${r['Record ID']}_w${warnings.length + 1}`, level: L, text: t, fix: f?.fix || '', ...(f?.invert ? { invert: true } : {}), source: 'v3' });
    });
  });
  const expected = leveled.filter((r) => r['Expected at this level'] === 'Yes' && r.Optional !== 'Yes');
  const firstLevel = expected.length ? LEVEL_ID[expected[0].Level] : leveled.length ? LEVEL_ID[leveled[0].Level] : 'Pro';
  skills.push({ id, axis: area, name, optional: optionalSkill, recordType: first['Record type'], levels, statements, warnings });
  items.push({
    id, name, es: first.Spanish, aka: first['Also called'], group, area,
    checked: leveled.length > 0 && statements.length > 0,
    optional: optionalSkill, firstLevel, what: first.Definition, when: first['When to use it'], source: 'v3',
    // "Quick check" = Yes: asked in the short version of the starting quiz.
    ...(rs.some((r) => r['Quick check'] === 'Yes') ? { key: true } : {}),
  });
}

framework.skills = skills;
framework._note = 'Skills come from 2-framework/framework-v3/padel-iq-skills.csv via npm run import-framework. Edit the CSV, not this file.';
framework.rules.optional = 'Optional rows and skills are never required: they are left out of both sides of any level sum, never cap a level, and checking more optional shots never raises a level.';
glossary.items = items;
glossary._note = 'Generated from 2-framework/framework-v3/padel-iq-skills.csv by npm run import-framework. name = English (or the padel word), es = Spanish, aka = other words (search).';
fs.writeFileSync(new URL('5-data/framework.json', ROOT), JSON.stringify(framework, null, 2) + '\n');
fs.writeFileSync(new URL('5-data/skills-glossary.json', ROOT), JSON.stringify(glossary, null, 2) + '\n');

console.log(`Imported ${skills.length} skills, ${skills.reduce((n, s) => n + s.statements.length, 0)} statements, ${skills.reduce((n, s) => n + s.warnings.length, 0)} warnings.`);
if (missingFix.size) console.log(`Warning questions with no goal wording in 5-data/warning-fixes.json (${missingFix.size}):\n- ${[...missingFix].join('\n- ')}`);

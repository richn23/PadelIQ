// Talking to the AI coach: builds the PLAYER FILE and calls the online helper (/api/coach).
import { allSkills, allSkillById, axes, levels } from './data.js';
import { currentLevel, currentAxisLevels, levelName, levelFocus, skillChecks } from './levels.js';
import { recentSessions } from './checkin.js';
import { goalSkill, goalNote } from './goals.js';
import { prettyDate, sortSessions, todayISO } from './sessions.js';

const CHECK = { better: 'better', same: 'same', struggling: 'still struggling' };

export function sessionSummary(s) {
  if (!s) return '';
  const who = s.kind === 'lesson'
    ? `Lesson${s.coach ? ' with ' + s.coach : ''}`
    : [s.partner && `with ${s.partner}`, s.opponents?.filter(Boolean).length ? `vs ${s.opponents.filter(Boolean).join(' & ')}` : ''].filter(Boolean).join(' ') || 'Match';
  return `${prettyDate(s.date, s.time)}, ${who}${s.venue ? ', ' + s.venue : ''}${s.intention ? `. Intention: "${s.intention}"` : ''}`;
}

export function buildPlayerFile(player, { skill } = {}) {
  const lvl = currentLevel(player);
  const areas = currentAxisLevels(player);
  const checks = skillChecks(player);
  const goals = player.goals || [];
  const sessions = recentSessions(player, 5);
  const L = [];
  L.push('PLAYER FILE (from the app; this is all you know about the player)');
  L.push(`Name: ${player.name || 'Player'}`);
  L.push(`Level: ${levelName(lvl)} (provisional: ${player.provisional ? 'yes' : 'no'})`);
  L.push(`Level focus: ${levelFocus(lvl)}`);
  L.push(`Areas: ${axes.map((a) => `${a.name} ${levelName(areas[a.id])}`).join(', ')}`);
  if (goals.length) {
    L.push('Goals:');
    goals.forEach((g) => {
      const recent = (player.sessions || []).filter((s) => s.goalChecks?.[g.id]).slice(-5).map((s) => CHECK[s.goalChecks[g.id]]);
      const dx = g.diagnosis?.problems?.length ? ` DIAGNOSIS: ${g.diagnosis.problems.join(', ')}${g.diagnosis.when ? `, mostly ${g.diagnosis.when}` : ''}.` : '';
      L.push(`- ${goalSkill(g)} (${g.skillId}): "${goalNote(g) || 'no words added'}", ${g.progress}% happy.${recent.length ? ` Last checks: ${recent.join(', ')}.` : ''}${dx}`);
    });
  } else L.push('Goals: none yet');
  const own = Object.entries(checks).filter(([, v]) => v.from !== 'quiz');
  L.push(`Skill levels checked: ${own.length ? own.map(([id, v]) => `${allSkillById[id]?.name} ${levelName(v.level)}${v.focus?.[0] ? ` (working on: ${v.focus[0]})` : ''}`).join('; ') : 'none yet (only the starting quiz)'}`);
  if (sessions.length) {
    L.push('Recent sessions (newest first):');
    sessions.forEach((s) => {
      const parts = [`- ${prettyDate(s.date)} ${s.kind}`];
      if (s.result?.outcome) parts.push(`${s.result.outcome}${s.result.score ? ' ' + s.result.score : ''}`);
      if (s.intention) parts.push(`intention "${s.intention}" (${s.intentionCheck || 'not marked'})`);
      if (s.notes?.worked) parts.push(`worked: "${s.notes.worked}"`);
      if (s.notes?.didnt) parts.push(`didn't: "${s.notes.didnt}"`);
      if (s.notes?.tryNext) parts.push(`try next: "${s.notes.tryNext}"`);
      if (s.coachSaid) parts.push(`coach said: "${s.coachSaid}"`);
      if (s.tags?.length) parts.push(`tags: ${s.tags.join(', ')}`);
      L.push(parts.join('; '));
    });
  } else L.push('Recent sessions: none logged yet');
  const last = (player.checkIns || []).slice(-1)[0];
  if (last) L.push(`Last check-in: working ${last.working?.join(', ') || '-'}; not working ${last.notWorking?.join(', ') || '-'}${last.note ? `; note "${last.note}"` : ''}`);
  L.push(`Skill names and ids: ${allSkills.filter((s) => s.checked).map((s) => `${s.name} (${s.id})`).join(', ')}`);
  if (skill) {
    L.push(`SKILL IN FOCUS: ${skill.name} (${skill.id}). What it is: ${skill.what} When: ${skill.when}`);
    L.push('Level descriptions:');
    levels.forEach((l) => { if (skill.levels[l.id]) L.push(`- ${l.name}: ${skill.levels[l.id].text}`); });
    if (skill.statements?.length) L.push(`Statements by level: ${skill.statements.map((st) => `[${levelName(st.level)}] ${st.text}`).join(' ')}`);
    const c = checks[skill.id];
    L.push(`Player's current answer for this skill: ${c ? `${levelName(c.level)}${c.from === 'quiz' ? ' (from quiz)' : ''}` : 'not checked'}`);
  }
  return L.join('\n');
}

export const nextPlanned = (player) => sortSessions(player.sessions).upcoming.find((s) => s.date >= todayISO());

export async function askCoach({ mode, vars = {}, playerFile, messages }) {
  if (location.protocol === 'file:') throw new Error('The coach only works in the online version of the app.');
  const r = await fetch('/api/coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, vars, playerFile, messages }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'The coach is not available right now.');
  return data;
}

// "today's", "tomorrow's", or "Saturday's"
function whenWord(date) {
  const t = todayISO();
  if (!date) return 'your next';
  if (date === t) return "today's";
  const d = new Date(t + 'T00:00:00'); d.setDate(d.getDate() + 1);
  const tomorrow = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  if (date === tomorrow) return "tomorrow's";
  return new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long' }) + "'s";
}

// The pre-match coach opens instantly with your own focus points (no waiting for the AI).
export function preMatchOpener(player, session) {
  const goals = player.goals || [];
  const points = [];
  if (session?.intention) points.push(session.intention);
  const targets = session?.targets?.length ? goals.filter((g) => session.targets.includes(g.id)) : goals;
  targets.forEach((g) => points.push(goalNote(g) ? `${goalSkill(g)}: ${goalNote(g)}` : goalSkill(g)));
  const lastTry = recentSessions(player, 3).map((s) => s.notes?.tryNext).filter(Boolean)[0];
  if (lastTry) points.push(`From last time: ${lastTry}`);
  const kind = session?.kind === 'lesson' ? 'lesson' : 'match';
  const what = session ? `${whenWord(session.date)} ${kind}` : 'your next game';
  if (!points.length) return `Nothing saved to focus on for ${what} yet.\n\nAt your level the priority is: ${levelFocus(currentLevel(player))}\n\nAnything on your mind?`;
  return `Here's a reminder of what you wanted to focus on in ${what}:\n${points.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nAnything else on your mind?`;
}

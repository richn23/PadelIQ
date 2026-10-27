// Talking to the AI coach: builds the PLAYER FILE and calls the online helper (/api/coach).
import { allSkills, allSkillById, axes, levels } from './data.js';
import { currentLevel, currentAxisLevels, levelName, levelFocus, skillChecks } from './levels.js';
import { recentSessions } from './checkin.js';
import { goalSkill, goalNote } from './goals.js';
import { threadLines } from './threads.js';
import { prettyDate, sortSessions, todayISO } from './sessions.js';
import { modeOf, levelKnown } from './modes.js';
import { playedGames, noteOf, themeCounts, patternLine } from './patterns.js';

// How the player wants to use the app, and how the coach should stand. The coach prompt explains these lines.
const MODE_NOTE = {
  fun: 'Just for fun. The player only logs games. Keep it light and short. No analysis or advice unless they ask.',
  reflect: 'A little reflection. The player wants to notice what happens and pick one thing to work on, not to be analysed. Plain words, short replies, at most one thing to work on.',
  full: 'The full picture. The player wants skills, goals, plans and reflection.',
};
const STANCE_PARTNER = "Thinking partner. This player is at the top of the scale and knows their game better than you can judge from notes. Ask ONE or TWO sharp questions, never a list, instead of advising: when does it break down (which shot before it, which score, which opponent, how tired)? Offer possible patterns as questions, not conclusions. No cue lists. Give advice only if asked, and then one idea.";
const STANCE_COACH = 'Coach. Follow the usual rules.';

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
  const known = levelKnown(player);
  const advanced = known && ['A', 'Pro'].includes(lvl);
  L.push(`Mode: ${MODE_NOTE[modeOf(player)]}`);
  if (known) {
    L.push(`Level: ${levelName(lvl)} (provisional: ${player.provisional ? 'yes' : 'no'})`);
    L.push(`Level focus: ${levelFocus(lvl)}`);
    L.push(`Areas: ${axes.map((a) => `${a.name} ${levelName(areas[a.id])}`).join(', ')}`);
  } else {
    L.push('Level: not given. This player skipped the skills check and has not said what level they are. Do not assume or estimate one: find out from what they describe.');
  }
  L.push(`Coaching stance: ${advanced ? STANCE_PARTNER : STANCE_COACH}`);
  if (goals.length) {
    L.push('Goals:');
    goals.forEach((g) => {
      const recent = (player.sessions || []).filter((s) => s.goalChecks?.[g.id]).slice(-5).map((s) => CHECK[s.goalChecks[g.id]]);
      const nw = `${g.now ? ` NOW: "${g.now}".` : ''}${g.want ? ` WANT: "${g.want}".` : ''}`;
      const dx = nw + (g.diagnosis?.problems?.length ? ` DIAGNOSIS: ${g.diagnosis.problems.join(', ')}${g.diagnosis.when ? `, mostly ${g.diagnosis.when}` : ''}.` : '');
      L.push(`- ${goalSkill(g)}${g.skillId ? ` (${g.skillId})` : ''}: "${goalNote(g) || 'no words added'}", ${g.progress}% happy.${recent.length ? ` Last checks: ${recent.join(', ')}.` : ''}${dx}`);
    });
  } else L.push('Goals: none yet');
  L.push(...threadLines(player));
  const own = Object.entries(checks).filter(([, v]) => v.from !== 'quiz');
  L.push(`Skill levels checked: ${own.length ? own.map(([id, v]) => `${allSkillById[id]?.name} ${levelName(v.level)}${v.focus?.[0] ? ` (working on: ${v.focus[0]})` : ''}`).join('; ') : (known ? 'none yet (only the starting quiz)' : 'none yet')}`);
  if (sessions.length) {
    L.push('Recent sessions (newest first):');
    sessions.forEach((s) => {
      const parts = [`- ${prettyDate(s.date)} ${s.kind}`];
      if (s.result?.outcome && s.result.outcome !== 'unknown') parts.push(`${s.result.outcome}${s.result.score ? ' ' + s.result.score : ''}`);
      if (s.feel) parts.push(`felt: ${s.feel}`);
      if (s.note) parts.push(`fun note: "${s.note}"`);
      if (s.intention) parts.push(`intention "${s.intention}" (${s.intentionCheck || 'not marked'})`);
      if (s.notes?.worked) parts.push(`worked: "${s.notes.worked}"`);
      if (s.notes?.didnt) parts.push(`didn't: "${s.notes.didnt}"`);
      if (s.notes?.tryNext) parts.push(`try next: "${s.notes.tryNext}"`);
      if (s.coachSaid) parts.push(`coach said: "${s.coachSaid}"`);
      if (s.tags?.length) parts.push(`tags: ${s.tags.join(', ')}`);
      L.push(parts.join('; '));
    });
  } else L.push('Recent sessions: none logged yet');
  // The whole story, not just the last 5: one short line per game, and what keeps coming up.
  const all = playedGames(player);
  const themes = themeCounts(player);
  if (themes.length) {
    L.push("PATTERNS in the player's own notes (grouped by the coach, counted by the app; quote these numbers exactly):");
    themes.slice(0, 5).forEach((t) => L.push(`- ${patternLine(t)}`));
  }
  if (all.length > 5) {
    L.push(`History of all ${all.length} games, oldest first (game number, date, result, how it felt, the player's note):`);
    all.slice(-60).forEach((s) => {
      const n = all.indexOf(s) + 1;
      const o = s.result?.outcome && s.result.outcome !== 'unknown' ? s.result.outcome[0].toUpperCase() : '-';
      L.push(`#${n} ${prettyDate(s.date)} ${o}${s.feel ? ' ' + s.feel : ''}${noteOf(s) ? ` "${noteOf(s)}"` : ''}`);
    });
  }
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

// Pull the "reply" text out of a JSON answer that is still arriving: {"reply": "Hello wor
function partialReply(raw) {
  const m = raw.match(/"reply"\s*:\s*"/);
  if (!m) return '';
  let out = '';
  for (let i = m.index + m[0].length; i < raw.length; i++) {
    const c = raw[i];
    if (c === '\\') {
      const n = raw[i + 1];
      if (n === undefined) break;
      out += n === 'n' ? '\n' : n === 't' ? ' ' : n === 'u' ? (raw.length >= i + 6 ? String.fromCharCode(parseInt(raw.slice(i + 2, i + 6), 16)) : '') : n;
      i += n === 'u' ? 5 : 1;
      continue;
    }
    if (c === '"') break;
    out += c;
  }
  return out;
}

export async function askCoach({ mode, vars = {}, playerFile, messages, onText }) {
  if (location.protocol === 'file:') throw new Error('The coach only works in the online version of the app.');
  const r = await fetch('/api/coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, vars, playerFile, messages, stream: !!onText }),
  });
  if ((r.headers.get('content-type') || '').includes('text/event-stream')) {
    // The answer arrives in pieces: show the words as they come.
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    let raw = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const parts = buf.split('\n\n');
      buf = parts.pop();
      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith('data:')) continue;
        const ev = JSON.parse(line.slice(5));
        if (ev.error) throw new Error(ev.error);
        if (ev.d) { raw += ev.d; onText?.(partialReply(raw)); }
      }
    }
    try { return JSON.parse(raw); } catch { return salvageReply(raw); }
  }
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'The coach is not available right now.');
  return data;
}

// Same idea as the server: never show raw JSON. Plain words plus a stray {"proposal": ...} bit, or JSON that never closes.
function salvageReply(raw) {
  let reply = String(raw).trim();
  let proposal = null;
  const pi = reply.search(/\{\s*"proposal"\s*:/);
  if (pi >= 0) {
    try { proposal = JSON.parse(reply.slice(pi)).proposal || null; } catch { /* leave it out */ }
    reply = reply.slice(0, pi).trim();
  }
  if (/^\{\s*"reply"\s*:/.test(reply)) reply = partialReply(reply).trim();
  return { reply: reply || String(raw).trim(), proposal };
}

// Ask the coach to group the notes. Notes are sent as numbered lines (game numbers), never ids.
export async function findThemes(player) {
  const games = playedGames(player);
  const numbered = games.map((s, i) => ({ n: i + 1, id: s.id, note: noteOf(s) })).filter((x) => x.note).slice(-40);
  const content = numbered.map((x) => `${x.n}: ${x.note.slice(0, 70)}`).join('\n');
  const r = await askCoach({ mode: 'themes', vars: {}, playerFile: '', messages: [{ role: 'user', content }] });
  const byN = Object.fromEntries(numbered.map((x) => [x.n, x.id]));
  const themes = (Array.isArray(r.themes) ? r.themes : [])
    .map((t) => ({ label: String(t.label || '').trim().slice(0, 40), ids: [...new Set((t.ids || []).map((n) => byN[Number(n)]).filter(Boolean))] }))
    .filter((t) => t.label && t.ids.length >= 2);
  return { at: games.length, themes, updated: new Date().toISOString() };
}

// "today's", "tomorrow's", or "Saturday's"
function whenWord(date) {
  const t = todayISO();
  if (!date) return 'your next';
  if (date === t) return "today's";
  const y = new Date(t + 'T00:00:00'); y.setDate(y.getDate() - 1);
  if (date === `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`) return "yesterday's";
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
  if (!points.length) return `Nothing saved to focus on for ${what} yet.${levelKnown(player) ? `\n\nAt your level the priority is: ${levelFocus(currentLevel(player))}` : ''}\n\nAnything on your mind?`;
  return `Here's a reminder of what you wanted to focus on in ${what}:\n${points.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nAnything else on your mind?`;
}

// The post-match coach opens instantly with one simple question.
export function postMatchOpener(session) {
  const kind = session?.kind === 'lesson' ? 'lesson' : 'match';
  return session ? `How do you feel about ${whenWord(session.date)} ${kind}?` : 'How do you feel about your last game?';
}

import { axes, allSkills } from './data.js';
import { currentLevel, levelOrder, firstMasterOrder } from './levels.js';

// Which skills to ask at a check-in: 1-2 per area.
// Order: your goals first, then skills you haven't checked yourself for longest, then the ones you tag most.
export function pickCheckInSkills(player, perArea = 2) {
  const goalSkills = new Set((player.goals || []).map((g) => g.skillId));
  const own = player.skillChecks || {};
  const tagCount = {};
  (player.sessions || []).forEach((s) => (s.tags || []).forEach((t) => { tagCount[t] = (tagCount[t] || 0) + 1; }));
  const maxOrder = levelOrder(currentLevel(player)) + 1; // your level and the next one up
  const picked = [];
  axes.forEach((a) => {
    const list = allSkills
      .filter((s) => s.axis === a.id && s.checked && Object.keys(s.levels).length && (firstMasterOrder(s) ?? 0) <= maxOrder)
      .sort((x, y) => {
        const g = (goalSkills.has(y.id) ? 1 : 0) - (goalSkills.has(x.id) ? 1 : 0);
        if (g) return g;
        const dx = own[x.id]?.date || '';
        const dy = own[y.id]?.date || '';
        if (dx !== dy) return dx.localeCompare(dy); // never checked ('') comes first
        return (tagCount[y.id] || 0) - (tagCount[x.id] || 0);
      });
    picked.push(...list.slice(0, perArea));
  });
  return picked;
}

// The last few played sessions, newest first.
export function recentSessions(player, n = 5) {
  return (player.sessions || [])
    .filter((s) => s.status === 'played')
    .sort((a, b) => `${b.date} ${b.time || ''}`.localeCompare(`${a.date} ${a.time || ''}`))
    .slice(0, n);
}

// A short summary of those sessions for the check-in review.
export function reviewSummary(player, n = 5) {
  const list = recentSessions(player, n);
  const matches = list.filter((s) => s.kind === 'match');
  const results = { won: 0, lost: 0, draw: 0 };
  matches.forEach((s) => { if (s.result?.outcome) results[s.result.outcome] += 1; });
  const tagCount = {};
  list.forEach((s) => (s.tags || []).forEach((t) => { tagCount[t] = (tagCount[t] || 0) + 1; }));
  const goalChecks = {};
  list.forEach((s) => Object.entries(s.goalChecks || {}).forEach(([g, v]) => {
    goalChecks[g] = goalChecks[g] || { better: 0, same: 0, struggling: 0 };
    goalChecks[g][v] += 1;
  }));
  const intentions = { yes: 0, partly: 0, no: 0 };
  list.forEach((s) => { if (s.intentionCheck) intentions[s.intentionCheck] += 1; });
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).map(([id, c]) => ({ id, count: c }));
  return { list, matches: matches.length, lessons: list.length - matches.length, results, topTags, goalChecks, intentions };
}

// Skills to ask about: what isn't working first, then what is, then goals, then the usual picks. 6 to 10 skills.
export function buildCheckInList(player, working = [], notWorking = []) {
  const usable = (id) => {
    const s = allSkills.find((x) => x.id === id);
    return s && s.checked && Object.keys(s.levels).length ? s : null;
  };
  const goals = (player.goals || []).map((g) => g.skillId);
  const ids = [...notWorking, ...working, ...goals];
  const out = [];
  ids.forEach((id) => { const s = usable(id); if (s && !out.includes(s)) out.push(s); });
  if (out.length < 6) pickCheckInSkills(player).forEach((s) => { if (out.length < 6 && !out.includes(s)) out.push(s); });
  return out.slice(0, 10);
}

import { axes, allSkills } from './data.js';

// Which skills to ask at a check-in: 1-2 per area.
// Order: your goals first, then skills you haven't checked yourself for longest, then the ones you tag most.
export function pickCheckInSkills(player, perArea = 2) {
  const goalSkills = new Set((player.goals || []).map((g) => g.skillId));
  const own = player.skillChecks || {};
  const tagCount = {};
  (player.sessions || []).forEach((s) => (s.tags || []).forEach((t) => { tagCount[t] = (tagCount[t] || 0) + 1; }));
  const picked = [];
  axes.forEach((a) => {
    const list = allSkills
      .filter((s) => s.axis === a.id && s.checked && Object.keys(s.levels).length)
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

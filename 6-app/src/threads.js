// Coaching threads: what the coach and the player worked on, what was suggested, and whether it helped.
// They are the player's own notes and the coach's working guesses, never diagnoses.

export const RESULT_LABEL = { suggested: 'suggested, not followed up yet', helped: 'helped', partly: 'helped a bit', no_help: "didn't help", not_tried: 'not tried yet', superseded: 'replaced by a newer plan' };

export const newThread = (p) => ({
  id: 't' + Date.now(),
  topic: String(p.topic || 'Something to work on').slice(0, 60),
  problem: String(p.problem || '').slice(0, 240),
  cause: String(p.cause || '').slice(0, 240),
  advice: [p.focus, ...(Array.isArray(p.cues) ? p.cues : [])].filter(Boolean).map((x) => String(x).slice(0, 160)),
  status: 'suggested',
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
});

// Save a coach proposal: a new plan replaces an old one on the same thread.
export const withThread = (player, p) => {
  const t = newThread(p);
  const list = (player.threads || []).map((x) => (p.replaces && x.id === p.replaces ? { ...x, status: 'superseded', updated: t.created } : x));
  return { ...player, threads: [...list, t].slice(-12) };
};

export const setThreadResult = (player, id, status) => ({
  ...player,
  threads: (player.threads || []).map((t) => (t.id === id ? { ...t, status, updated: new Date().toISOString() } : t)),
});

// Plans waiting to hear how they went.
export const openThreads = (player) => (player.threads || []).filter((t) => t.status === 'suggested' || t.status === 'not_tried');

const daysAgo = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`;
};

// Lines for the coach's PLAYER FILE.
export function threadLines(player) {
  const list = (player.threads || []).filter((t) => t.status !== 'superseded').slice(-6);
  if (!list.length) return [];
  const L = ['Coaching threads (earlier chats; the player\'s own words and working guesses, not facts):'];
  list.forEach((t) => {
    L.push(`- ${t.topic} (${daysAgo(t.created)}; ${RESULT_LABEL[t.status] || t.status}): problem "${t.problem}"; cause considered "${t.cause}"; advice given: ${t.advice.join(' / ')}`);
  });
  return L;
}

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
  const list = (player.threads || []).map((x) => (p.replaces && x.id === p.replaces ? { ...x, status: x.status === 'suggested' || x.status === 'not_tried' ? 'no_help' : x.status, feedback: String(p.feedback || x.feedback || '').slice(0, 200), replacedBy: t.id, updated: t.created } : x));
  t.attempt = 1 + (p.replaces ? ((player.threads || []).find((x) => x.id === p.replaces)?.attempt || 1) : 0);
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
  const all = player.threads || [];
  const list = all.filter((t) => !t.replacedBy).slice(-6);
  if (!list.length) return [];
  const failed = (topic) => all.filter((t) => t.topic === topic && (t.status === 'no_help' || t.status === 'partly') && t.replacedBy).length;
  const L = ['Coaching threads (earlier chats; the player\'s own words and working guesses, not facts):'];
  list.forEach((t) => {
    const n = failed(t.topic);
    const prior = all.filter((x) => x.topic === t.topic && x.replacedBy && x.feedback).slice(-2).map((x) => `earlier advice "${x.advice[0]}" -> player said: "${x.feedback}"`);
    L.push(`- ${t.topic} (${daysAgo(t.created)}; ${RESULT_LABEL[t.status] || t.status}${n ? `; ${n} earlier attempt${n > 1 ? 's' : ''} on this topic did not work` : ''}): problem "${t.problem}"; cause considered "${t.cause}"; advice given: ${t.advice.join(' / ')}${prior.length ? `; history: ${prior.join('; ')}` : ''}`);
  });
  return L;
}

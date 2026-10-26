// Your data lives on this phone (in the browser's own storage). Nothing is sent anywhere.
const KEY = 'padeliq-player';

// Framework v3 split two skills by wing. Goals keep their old skill (see goals.js);
// match tags move to the forehand version; old skill checks for the combined skill are dropped,
// so each wing is checked on its own.
const RENAMED = { volley: 'volley_forehand', groundstrokes: 'groundstroke_forehand' };
export function migratePlayer(p) {
  if (!p) return p;
  const ren = (id) => RENAMED[id] || id;
  const drop = (obj) => Object.fromEntries(Object.entries(obj || {}).filter(([k]) => !RENAMED[k]));
  return {
    ...p,
    sessions: (p.sessions || []).map((s) => ({ ...s, ...(s.tags ? { tags: [...new Set(s.tags.map(ren))] } : {}) })),
    skillChecks: drop(p.skillChecks),
    quizChecks: drop(p.quizChecks),
  };
}

export function loadPlayer() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? migratePlayer(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function savePlayer(player) {
  try {
    localStorage.setItem(KEY, JSON.stringify(player));
  } catch {
    /* storage blocked: the app still works for this visit */
  }
}

export function clearPlayer() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}

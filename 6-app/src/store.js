// Your data lives on this phone (in the browser's own storage). Nothing is sent anywhere.
const KEY = 'padeliq-player';

export function loadPlayer() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
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

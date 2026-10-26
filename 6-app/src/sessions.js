// Helpers for matches and lessons ("sessions").
export const CHECKIN_EVERY = 5;

// Today's date in the phone's own time zone (not UTC).
export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function sortSessions(list = []) {
  const key = (s) => `${s.date} ${s.time || '00:00'}`;
  const upcoming = list.filter((s) => s.status === 'planned').sort((a, b) => key(a).localeCompare(key(b)));
  const played = list.filter((s) => s.status === 'played').sort((a, b) => key(b).localeCompare(key(a)));
  return { upcoming, played };
}

export function prettyDate(date, time) {
  if (!date) return '';
  const d = new Date(date + 'T00:00:00');
  const day = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  return time ? `${day}, ${time}` : day;
}

export function sessionsUntilCheckIn(player) {
  const every = player.checkInEvery || CHECKIN_EVERY;
  const since = (player.sessions || []).filter((s) => s.status === 'played' && (!player.lastCheckIn || s.playedAt > player.lastCheckIn)).length;
  return Math.max(every - since, 0);
}

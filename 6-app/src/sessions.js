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

// A session is over once it should have finished (match 90 min, lesson 60), or after its day if it has no time.
// Added after playing, or with a result: over already. So "tonight at 8pm" stays upcoming until about 9.
const DURATION = { match: 90, lesson: 60 };
export const endsAt = (s) => (s.time ? new Date(new Date(`${s.date}T${s.time}`).getTime() + (DURATION[s.kind] || 90) * 60000) : null);
export function isOver(s, now = new Date()) {
  if (s.logged || s.result) return true;
  const end = endsAt(s);
  return end ? end <= now : s.date < todayISO();
}

// A calendar reminder for when the session should end: "reflect on your lesson".
const pad = (n) => String(n).padStart(2, '0');
const stamp = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
export function reminderICS(s, url) {
  const end = endsAt(s);
  if (!end) return null;
  const what = s.kind === 'lesson' ? 'lesson' : 'game';
  const now = new Date();
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Padel IQ//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:${s.id}@padeliq`,
    `DTSTAMP:${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`,
    `DTSTART:${stamp(end)}`, `DTEND:${stamp(new Date(end.getTime() + 15 * 60000))}`,
    `SUMMARY:Padel IQ: reflect on your ${what}`,
    `DESCRIPTION:Two minutes: how did it feel, and what is one thing to work on? Open Padel IQ: ${url}`,
    `URL:${url}`,
    'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', `DESCRIPTION:Reflect on your ${what}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}
// Phones: the share sheet (choose Calendar). Otherwise a download. Returns a short message.
export async function addReminder(s) {
  const ics = reminderICS(s, location.origin + location.pathname);
  if (!ics) return 'Add a time first, then I can set a reminder.';
  const blob = new Blob([ics], { type: 'text/calendar' });
  try {
    const file = new File([blob], 'padel-iq-reminder.ics', { type: 'text/calendar' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Padel IQ reminder' }); return 'Choose Calendar to save the reminder.'; }
  } catch { /* fall back to download */ }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'padel-iq-reminder.ics';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  return 'Reminder file saved. Open it to add it to your calendar.';
}

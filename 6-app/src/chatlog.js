// Every coach conversation is kept in this browser only (never sent anywhere), so you can export them and learn from them.
const KEY = 'padeliq-chatlog';
const MAX_CHATS = 80;

export const getChats = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
export const clearChats = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } };

// Save or update one conversation. `id` stays the same while the chat goes on.
export function logChat(id, meta, messages) {
  try {
    const all = getChats().filter((c) => c.id !== id);
    const prev = getChats().find((c) => c.id === id);
    all.push({ id, started: prev?.started || new Date().toISOString(), updated: new Date().toISOString(), ...meta, messages });
    localStorage.setItem(KEY, JSON.stringify(all.slice(-MAX_CHATS)));
  } catch { /* storage full or blocked: skip quietly */ }
}

const when = (iso) => new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

// A plain text file that is easy to read, or to paste into another AI to review.
export function chatsToText(chats = getChats()) {
  const out = [`Padel IQ coach conversations (${chats.length})`, `Exported ${when(new Date().toISOString())}`, ''];
  chats.forEach((c, n) => {
    out.push(`=== Chat ${n + 1}: ${c.title || c.mode} (${c.mode}) · ${when(c.started)} ===`);
    out.push(`Coach style: ${c.style || 'conversational'} · Player mode: ${c.playerMode || 'full'}`);
    if (c.context) out.push(`Context: ${c.context}`);
    out.push('');
    c.messages.forEach((m) => {
      if (m.role === 'user') out.push(`PLAYER: ${m.content}`);
      else {
        out.push(`COACH: ${m.content}${m.timing?.total ? `  [${(m.timing.total / 1000).toFixed(1)}s]` : ''}`);
        if (m.proposal) out.push(`  (offered to save: ${m.proposal}${m.result ? `, player: ${m.result}` : ''})`);
      }
      out.push('');
    });
  });
  return out.join('\n');
}

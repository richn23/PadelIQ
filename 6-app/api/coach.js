// Padel IQ coach helper (runs on Vercel, not on the phone).
// It adds the OpenAI key (from Vercel's environment variables) and the coach prompts,
// asks OpenAI, and sends the answer back. The key never reaches the phone.
import prompts from './_coach-prompts.js';
import { pickCards, notesSection } from './_knowledge.js';

const OPENAI = 'https://api.openai.com/v1';
let cachedModel = null;

// Use OPENAI_MODEL if set in Vercel. Otherwise pick a small, cheap model the key can use.
async function pickModel(key) {
  if (process.env.OPENAI_MODEL) return process.env.OPENAI_MODEL;
  if (cachedModel) return cachedModel;
  try {
    const r = await fetch(`${OPENAI}/models`, { headers: { Authorization: `Bearer ${key}` } });
    const ids = (await r.json()).data.map((m) => m.id).filter((id) => id.startsWith('gpt') && !/audio|realtime|transcribe|tts|image|search|instruct/.test(id));
    const prefer = [/luna/, /mini/, /nano/];
    for (const p of prefer) {
      const hit = ids.filter((id) => p.test(id) && !/\d{4}-\d{2}-\d{2}/.test(id)).sort().reverse()[0];
      if (hit) return (cachedModel = hit);
    }
    cachedModel = ids.sort().reverse()[0] || 'gpt-4o-mini';
  } catch {
    cachedModel = 'gpt-4o-mini';
  }
  return cachedModel;
}

// The model sometimes answers with plain words plus a stray JSON bit, or with JSON that never closes.
// Never show raw JSON to the player: pull the words out, and the proposal if it is complete.
function stripCites(t) {
  return t.replace(/\uE200[^\uE201]*\uE201/g, '').replace(/[\uE200-\uE206]/g, '').replace(/\s*cite(?:turn\d+(?:search|view|news|image)\d+)+/g, '').replace(/\*\*|__/g, '').replace(/\s*—\s*/g, ', ').replace(/ – /g, ', ').replace(/ {2,}/g, ' ').replace(/ +([.,])/g, '$1').trim();
}

function salvage(text) {
  let reply = String(text).trim();
  let proposal = null;
  // A stray tail like `","proposal":null}` after plain words.
  const tail = reply.match(/"\s*,\s*"proposal"\s*:\s*(null|\{[\s\S]*\})\s*\}\s*$/);
  if (tail) {
    if (tail[1] !== 'null') { try { proposal = JSON.parse(tail[1]); } catch { /* leave it out */ } }
    reply = reply.slice(0, tail.index).trim();
  }
  // Words followed by the same answer again as unfinished JSON: keep only the first part.
  const dup = reply.search(/\s*\{\s*"reply"\s*:/);
  if (dup > 0) reply = reply.slice(0, dup).trim();
  const pi = reply.search(/\{\s*"proposal"\s*:/);
  if (pi >= 0) {
    try { proposal = JSON.parse(reply.slice(pi)).proposal || null; } catch { /* leave it out */ }
    reply = reply.slice(0, pi).trim();
  }
  const m = reply.match(/^\{\s*"reply"\s*:\s*"/);
  if (m) {
    let out = '';
    for (let i = m[0].length; i < reply.length; i++) {
      const c = reply[i];
      if (c === '\\') { const n = reply[i + 1]; if (n === undefined) break; out += n === 'n' ? '\n' : n; i++; continue; }
      if (c === '"') break;
      out += c;
    }
    const pm = reply.match(/"proposal"\s*:\s*(\{[\s\S]*\})\s*\}?\s*$/);
    if (pm && !proposal) { try { proposal = JSON.parse(pm[1]); } catch { /* leave it out */ } }
    reply = out.trim();
  }
  return { reply: reply || String(text).trim(), proposal };
}

const fill = (text, vars) => text.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] ?? ''));

// Different models accept different settings. Try the fastest first, and remember what works
// (for as long as this server instance stays warm), so later questions don't repeat failed tries.
// Each mode says how much a reasoning model may think (5-data/coach-prompts.json, defaults.thinking).
// Facts and quick chats: 'minimal'. Placing a level or setting a goal: 'low'.
const settingsFor = (effort) => [
  { reasoning_effort: effort, max_completion_tokens: 900 },
  { reasoning_effort: 'low', max_completion_tokens: 900 },
  { temperature: prompts.defaults.temperature, max_completion_tokens: 700 }, // classic chat models
  {}, // anything else
];
let goodSettings = null; // which kind worked last time: 0-1 reasoning, 2 classic, 3 plain

async function openChat(key, model, messages, stream, effort = 'low') {
  const SETTINGS = settingsFor(effort);
  const order = goodSettings !== null ? [goodSettings, ...SETTINGS.keys()].filter((v, i, a) => a.indexOf(v) === i) : [...SETTINGS.keys()];
  let lastError = '';
  for (const i of order) {
    const body = { model, messages, response_format: { type: 'json_object' }, stream, ...SETTINGS[i] };
    const r = await fetch(`${OPENAI}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (r.ok) { goodSettings = i; return r; }
    const data = await r.json().catch(() => ({}));
    lastError = data?.error?.message || `OpenAI error ${r.status}`;
    if (r.status !== 400) break;
  }
  throw new Error(lastError);
}

async function ask(key, model, messages, effort) {
  const r = await openChat(key, model, messages, false, effort);
  const data = await r.json();
  return data.choices[0].message.content;
}

// Streams the answer to the phone as it's written, so words appear straight away.
async function streamAnswer(key, model, messages, res, effort) {
  const r = await openChat(key, model, messages, true, effort);
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' });
  const reader = r.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith('data:')) continue;
      const payload = t.slice(5).trim();
      if (payload === '[DONE]') continue;
      try {
        const d = JSON.parse(payload).choices?.[0]?.delta?.content;
        if (d) res.write(`data: ${JSON.stringify({ d })}\n\n`);
      } catch { /* ignore partial lines */ }
    }
  }
  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
}

// Web search (only for modes that allow it): OpenAI's Responses API with its web search tool.
// Returns { text, sources }. If the tool isn't available, returns null so we fall back to a normal answer.
async function askWithSearch(key, model, messages, effort) {
  const input = messages.map((m) => ({ role: m.role === 'system' ? 'developer' : m.role, content: m.content }));
  const tries = [['web_search', true], ['web_search', false], ['web_search_preview', false]];
  for (const [tool, think] of tries) {
    const r = await fetch(`${OPENAI}/responses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      // Searching needs a little thinking, so never less than 'low' here.
      body: JSON.stringify({ model, input, tools: [{ type: tool }], ...(think ? { reasoning: { effort: effort === 'minimal' ? 'low' : effort } } : {}) }),
    });
    const data = await r.json();
    if (!r.ok) continue;
    let text = '';
    const sources = [];
    for (const item of data.output || []) {
      if (item.type !== 'message') continue;
      for (const c of item.content || []) {
        if (c.type !== 'output_text') continue;
        text += c.text;
        for (const a of c.annotations || []) {
          if (a.type === 'url_citation' && a.url && !sources.some((s) => s.url === a.url)) sources.push({ title: a.title || a.url, url: a.url });
        }
      }
    }
    if (text) return { text, sources };
  }
  return null;
}

export default async function handler(req, res) {
  const key = process.env.OPENAI_API_KEY;
  if (req.method === 'GET') {
    // Quick check from the app: is the key set, and which model is used?
    if (!key) return res.status(200).json({ ok: false, reason: 'OPENAI_API_KEY is not set in Vercel' });
    return res.status(200).json({ ok: true, model: await pickModel(key) });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  if (!key) return res.status(500).json({ error: 'The coach is not set up yet (no API key in Vercel).' });

  const { mode, vars = {}, playerFile = '', messages = [], stream: wantStream = false } = req.body || {};
  const m = prompts.modes.find((x) => x.id === mode);
  if (!m) return res.status(400).json({ error: 'Unknown coach mode' });
  if (messages.length > 30 || JSON.stringify(req.body).length > 40000) return res.status(413).json({ error: 'Conversation too long' });

  const v = { style: prompts.defaults.style, ...vars };
  const notes = notesSection(pickCards({ messages, vars, playerFile }));
  const system = [fill(prompts.shared, v), fill(m.prompt, v), notes, playerFile].filter(Boolean).join('\n\n');
  const chat = [
    { role: 'system', content: system },
    ...messages.filter((x) => x && (x.role === 'user' || x.role === 'assistant') && typeof x.content === 'string').map((x) => ({ role: x.role, content: x.content.slice(0, 2000) })),
  ];
  if (chat.length === 1) chat.push({ role: 'user', content: 'Start.' });

  try {
    const model = await pickModel(key);
    const effort = prompts.defaults.thinking?.[mode] || 'low';
    let text;
    let sources = [];
    // Searching the web is slow and cannot stream, so only do it when the question needs current facts.
    const lastUser = [...messages].reverse().find((x) => x && x.role === 'user')?.content || '';
    const needsSearch = /racket|racquet|paddle|brand|bullpadel|nox|head\b|babolat|adidas|siux|wilson|shoes?\b|balls?\b|grip|price|cost|buy|cheap|deal|rule|rules|fip\b|ranking|ranked|tour\b|tournament|premier|world number|number one|no\.? ?1|who (is|won|are)|latest|newest|new model|202\d|news|schedule|result|score of|vs\.?\b|versus|compare|best .*(racket|shoes|ball|brand)|court (size|dimension)|where can i/i.test(String(lastUser));
    if (m.usesWebSearch && needsSearch) {
      const found = await askWithSearch(key, model, chat, effort).catch(() => null);
      if (found) { text = found.text; sources = found.sources; }
    }
    if (!text && wantStream) return await streamAnswer(key, model, chat, res, effort);
    if (!text) text = await ask(key, model, chat, effort);
    let out;
    try {
      // Answers may come as JSON, sometimes wrapped in a code block.
      out = JSON.parse(text.replace(/^```(json)?\s*/i, '').replace(/```\s*$/, ''));
    } catch {
      out = salvage(text);
    }
    // Search tools sometimes leave citation markers in the words (private-use brackets, or 'citeturn0search0'). Never show them.
    if (typeof out.reply === 'string') out.reply = stripCites(out.reply);
    if (sources.length) out.sources = sources.slice(0, 4);
    return res.status(200).json(out);
  } catch (e) {
    if (res.headersSent) { res.write(`data: ${JSON.stringify({ error: String(e.message || e) })}\n\n`); return res.end(); }
    return res.status(502).json({ error: String(e.message || e) });
  }
}

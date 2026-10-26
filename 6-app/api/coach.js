// Padel IQ coach helper (runs on Vercel, not on the phone).
// It adds the OpenAI key (from Vercel's environment variables) and the coach prompts,
// asks OpenAI, and sends the answer back. The key never reaches the phone.
import prompts from './_coach-prompts.js';

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

const fill = (text, vars) => text.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] ?? ''));

async function ask(key, model, messages, attempt = 0) {
  const body = { model, messages, response_format: { type: 'json_object' } };
  if (attempt === 0) { body.temperature = prompts.defaults.temperature; body.max_completion_tokens = 700; }
  const r = await fetch(`${OPENAI}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) {
    // Some models don't accept temperature or a token limit: try once more without them.
    if (attempt === 0 && r.status === 400) return ask(key, model, messages, 1);
    throw new Error(data?.error?.message || `OpenAI error ${r.status}`);
  }
  return data.choices[0].message.content;
}

// Web search (only for modes that allow it): OpenAI's Responses API with its web search tool.
// Returns { text, sources }. If the tool isn't available, returns null so we fall back to a normal answer.
async function askWithSearch(key, model, messages) {
  const input = messages.map((m) => ({ role: m.role === 'system' ? 'developer' : m.role, content: m.content }));
  for (const tool of ['web_search', 'web_search_preview']) {
    const r = await fetch(`${OPENAI}/responses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, input, tools: [{ type: tool }] }),
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

  const { mode, vars = {}, playerFile = '', messages = [] } = req.body || {};
  const m = prompts.modes.find((x) => x.id === mode);
  if (!m) return res.status(400).json({ error: 'Unknown coach mode' });
  if (messages.length > 30 || JSON.stringify(req.body).length > 40000) return res.status(413).json({ error: 'Conversation too long' });

  const v = { style: prompts.defaults.style, ...vars };
  const system = [fill(prompts.shared, v), fill(m.prompt, v), playerFile].join('\n\n');
  const chat = [
    { role: 'system', content: system },
    ...messages.filter((x) => x && (x.role === 'user' || x.role === 'assistant') && typeof x.content === 'string').map((x) => ({ role: x.role, content: x.content.slice(0, 2000) })),
  ];
  if (chat.length === 1) chat.push({ role: 'user', content: 'Start.' });

  try {
    const model = await pickModel(key);
    let text;
    let sources = [];
    if (m.usesWebSearch) {
      const found = await askWithSearch(key, model, chat).catch(() => null);
      if (found) { text = found.text; sources = found.sources; }
    }
    if (!text) text = await ask(key, model, chat);
    let out;
    try {
      // Answers may come as JSON, sometimes wrapped in a code block.
      out = JSON.parse(text.replace(/^```(json)?\s*/i, '').replace(/```\s*$/, ''));
    } catch {
      out = { reply: text, proposal: null };
    }
    if (sources.length) out.sources = sources.slice(0, 4);
    return res.status(200).json(out);
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}

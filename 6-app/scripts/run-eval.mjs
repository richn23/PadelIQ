// Runs 5-data/coach-eval.json against the live coach and prints each reply.
// Usage: node scripts/run-eval.mjs [url] [id-prefix]   (needs internet; default https://padel-iq-coral.vercel.app)
import fs from 'fs';
const base = process.argv[2] || 'https://padel-iq-coral.vercel.app';
const only = process.argv[3] || '';
const { scenarios } = JSON.parse(fs.readFileSync(new URL('../../5-data/coach-eval.json', import.meta.url), 'utf8'));
for (const s of scenarios.filter((x) => x.id.startsWith(only))) {
  console.log(`\n=== ${s.id} (${s.mode}) ===\nEXPECT: ${s.expect}`);
  const messages = [];
  for (const line of s.player) {
    messages.push({ role: 'user', content: line });
    const r = await fetch(`${base}/api/coach`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: s.mode, vars: s.vars || {}, playerFile: s.playerFile || '', messages }) });
    const j = await r.json().catch(() => ({}));
    const reply = j.reply || j.text || j.message || JSON.stringify(j);
    console.log(`PLAYER: ${line}\nCOACH: ${reply}\n`);
    messages.push({ role: 'assistant', content: typeof reply === 'string' ? reply : JSON.stringify(reply) });
  }
}

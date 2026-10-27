// Run: npm run check:salvage. Makes sure stray JSON never shows up in a coach reply.
import fs from 'fs';
const src = fs.readFileSync(new URL('../api/coach.js', import.meta.url), 'utf8');
const salvage = eval('(' + src.match(/function salvage\(text\) \{[\s\S]*?\n\}\n/)[0].replace('function salvage', 'function') + ')');
const cases = [
  ['Is it off a volley?{"reply":"Is it off a vol', 'Is it off a volley?'],
  ['Plain words.\n{"reply":"Plain words.","proposal":null}', 'Plain words.'],
  ['Plain words.","proposal":null}', 'Plain words.'],
  ['{"reply":"Hi there","proposal":null}', 'Hi there'],
  ['{"reply":"Hi \\"there\\"","proposal":null}', 'Hi "there"'],
  ['Words here. {"proposal":null}', 'Words here.'],
];
let bad = 0;
for (const [i, o] of cases) { const r = salvage(i).reply; if (r !== o) { bad++; console.log('FAIL', JSON.stringify(i), '=>', JSON.stringify(r)); } }
console.log(bad ? `${bad} failed` : 'all ' + cases.length + ' salvage cases pass');
process.exit(bad ? 1 : 0);

// Picks the few coaching notes that fit this conversation and turns them into a prompt section.
import knowledge from './_coach-knowledge.js';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hit = (text, kw) => new RegExp('(^|[^a-z])' + esc(kw.toLowerCase()) + '([^a-z]|$)').test(text);

export function pickCards({ messages = [], vars = {}, playerFile = '' }, max = 3) {
  const user = messages.filter((m) => m.role === 'user').slice(-6).map((m) => String(m.content)).join(' \n ');
  const threads = (playerFile.match(/Coaching threads:[\s\S]*$/) || [''])[0];
  const text = (user + ' \n ' + (vars.skill_name || '') + ' \n ' + threads).toLowerCase();
  const scored = knowledge.cards.map((c) => {
    // Longer phrases count for more than single words; the latest player message counts double.
    const last = (user.split(' \n ').pop() || '').toLowerCase();
    let score = 0;
    for (const kw of c.keywords) {
      if (hit(text, kw)) score += kw.includes(' ') ? 3 : 1;
      if (hit(last, kw)) score += kw.includes(' ') ? 3 : 1;
    }
    return { c, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  const top = scored[0]?.score || 0;
  return scored.filter((x) => x.score >= top * 0.5).slice(0, max).map((x) => x.c);
}

export function notesSection(cards) {
  if (!cards.length) return '';
  const lines = cards.map((c) => {
    const parts = [
      `${c.name.toUpperCase()} (evidence: ${c.strength})`,
      'Points: ' + c.facts.join(' '),
    ];
    if (c.mistakes.length) parts.push('Common mistakes: ' + c.mistakes.join('; ') + '.');
    if (c.causes?.length) parts.push('Possible causes (candidates, never a diagnosis): ' + c.causes.map((x) => `"${x[0]}" may involve ${x[1]}. Tell apart: ${x[2]}`).join(' | '));
    if (c.depends?.length) parts.push('The advice changes with the situation: ' + c.depends.join(' '));
    if (c.practice?.length) parts.push('Practice ideas from coaching guides (suggest at most one): ' + c.practice.join(' / '));
    if (c.drills) parts.push('Optional practice ideas (offer at most one, only if the player wants to improve this; basis: ' + c.drills.basis + '): technique: ' + c.drills.technique + ' | decision: ' + c.drills.decision + ' | in a match: ' + c.drills.match);
    if (c.ask.length) parts.push('Good questions: ' + c.ask.join(' / '));
    if (c.avoid.length) parts.push('Do not: ' + c.avoid.join(' '));
    return '- ' + parts.join('\n  ');
  });
  return 'COACHING NOTES (from published coaching guides, FIP rules and sport-science studies; not yet checked by a qualified coach). For technical or tactical advice on these topics, stay inside the notes. If a note says evidence is limited, do not give technique details: ask what happens and suggest a coach watching. Never say "my notes" or name sources unless asked; if asked, say it is based on published coaching guidance and is not a replacement for a coach. These notes are possibilities to check with the player, not a diagnosis.\n' + lines.join('\n');
}

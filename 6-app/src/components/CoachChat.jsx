import React, { useEffect, useRef, useState } from 'react';
import think from '../assets/mascot-think.png';
import { askCoach, buildPlayerFile } from '../coach.js';

// A conversation with the AI coach in one mode. When the coach suggests something
// (a level, a goal, notes), the player taps Accept or Not quite. Nothing is saved without that tap.
export default function CoachChat({ mode, title, vars = {}, player, skill, onProposal, onClose, opener, intro }) {
  const [msgs, setMsgs] = useState(intro ? [{ role: 'assistant', content: intro }] : []); // { role, content, proposal? }
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState(''); // the answer as it arrives
  const [error, setError] = useState('');
  const [done, setDone] = useState({}); // proposal index -> 'accepted' | 'declined'
  const endRef = useRef(null);
  const started = useRef(false);

  const send = async (text, history = msgs) => {
    const next = text ? [...history, { role: 'user', content: text }] : history;
    setMsgs(next);
    setInput('');
    setBusy(true);
    setError('');
    try {
      const out = await askCoach({
        mode,
        vars,
        playerFile: buildPlayerFile(player, { skill }),
        messages: next.map((m) => ({ role: m.role, content: m.role === 'assistant' ? JSON.stringify({ reply: m.content, proposal: m.proposal || null }) : m.content })),
        onText: (t) => setLive(t.replace(/\*\*|__/g, '').replace(/\s*—\s*/g, ', ')),
      });
      setLive('');
      const reply = out.reply || [out.title, out.body].filter(Boolean).join('. ') || '…';
      // Sources are listed under the answer, so tidy inline links like [fipadel.com](https://...) to plain words.
      const clean = reply.replace(/[\uE200-\uE206]/g, '').replace(/\s*cite(?:turn\d+(?:search|view|news|image)\d+)+/g, '').replace(/\(?\[([^\]]+)\]\((https?:[^)]+)\)\)?/g, '').replace(/\*\*|__/g, '').replace(/\s*—\s*/g, ', ').replace(/ – /g, ', ').replace(/ +([.,])/g, '$1').trim();
      // Don't offer the same plan twice in a row.
      const prev = [...next].reverse().find((m) => m.proposal && m.proposal.type === out.proposal?.type);
      const same = prev && String(prev.proposal.focus || prev.proposal.title || '').trim().toLowerCase() === String(out.proposal.focus || out.proposal.title || '').trim().toLowerCase();
      setMsgs([...next, { role: 'assistant', content: clean || reply, proposal: same ? null : (out.proposal || null), sources: out.sources || [], timing: out.timing }]);
    } catch (e) {
      setLive('');
      setError(String(e.message || e));
    }
    setBusy(false);
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!intro) send(opener || null, []);
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, busy, live]);

  const accept = (i, p) => { const r = onProposal?.(p); setDone({ ...done, [i]: typeof r === 'string' ? r : 'accepted' }); };
  const decline = (i) => { setDone({ ...done, [i]: 'declined' }); send('Not quite.'); };

  return (
    <section className="panel coach-chat">
      <div className="row-between">
        <p className="eyebrow">{title}</p>
        {onClose && <button className="mini quiet" onClick={onClose}>Close</button>}
      </div>

      <div className="chat">
        {msgs.map((m, i) => (
          <div key={i} className={'msg ' + m.role}>
            {m.role === 'assistant' && <img src={think} alt="" className="msg-face" />}
            <div className="msg-body">
              <p>{m.content}</p>
              {m.timing && <p className="soft timing">{m.timing.first !== null && m.timing.first !== undefined ? `First word ${(m.timing.first / 1000).toFixed(1)}s · ` : ''}Answered in {(m.timing.total / 1000).toFixed(1)}s{m.sources?.length ? ' · web search' : ''}</p>}
              {m.sources?.length > 0 && (
                <p className="sources">Sources: {m.sources.map((src, k) => (
                  <React.Fragment key={src.url}>{k ? ', ' : ''}<a href={src.url} target="_blank" rel="noopener noreferrer">{src.title.length > 40 ? new URL(src.url).hostname.replace(/^www\./, '') : src.title}</a></React.Fragment>
                ))}</p>
              )}
              {m.proposal && (
                <div className="proposal">
                  <ProposalText p={m.proposal} />
                  {!done[i] && msgs.slice(i + 1).some((x) => x.proposal && x.proposal.type === m.proposal.type) ? (
                    <p className="soft">Replaced by the newer plan below.</p>
                  ) : !done[i] ? (
                    <div className="session-actions">
                      <button className="mini on" onClick={() => accept(i, m.proposal)}>Accept</button>
                      <button className="mini" onClick={() => decline(i)}>Not quite</button>
                    </div>
                  ) : <p className="soft">{done[i] === 'accepted' ? 'Saved.' : done[i] === 'declined' ? 'OK, let\'s adjust.' : done[i]}</p>}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && live && (
          <div className="msg assistant"><img src={think} alt="" className="msg-face" /><div className="msg-body"><p>{live}</p></div></div>
        )}
        {busy && !live && <Thinking first={msgs.filter((m) => m.role === 'assistant').length === 0} />}
        <div ref={endRef} />
      </div>
      {error && <p className="soft error">{error}</p>}
      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); if (input.trim() && !busy) send(input.trim()); }}>
        <textarea rows="2" value={input} placeholder="Type your answer" onChange={(e) => setInput(e.target.value)} aria-label="Your message" />
        <button className="btn" disabled={busy || !input.trim()}>Send</button>
      </form>
      <p className="soft tiny">The coach only knows what you've logged in the app. It suggests; you decide.</p>
    </section>
  );
}

function ProposalText({ p }) {
  if (p.type === 'skill_level') return <p><strong>Suggested level: {p.level}</strong>{p.reason ? ` · ${p.reason}` : ''}</p>;
  if (p.type === 'goal') return <p><strong>Suggested goal:</strong> {p.title}{p.progress != null ? ` (${p.progress}% happy now)` : ''}</p>;
  if (p.type === 'park_goal') return <p><strong>Park this goal for now?</strong> You can pick it up again later.</p>;
  if (p.type === 'thread') return (
    <div>
      <p><strong>Save this to try on court?</strong></p>
      {p.focus && <p>{p.focus}</p>}
      {Array.isArray(p.cues) && p.cues.map((c, i) => <p key={i} className="soft">· {c}</p>)}
    </div>
  );
  if (p.type === 'reflection') return (
    <div>
      <p><strong>Save these notes?</strong></p>
      {p.notes?.worked && <p className="soft">Worked: {p.notes.worked}</p>}
      {p.notes?.didnt && <p className="soft">Didn't: {p.notes.didnt}</p>}
      {p.notes?.tryNext && <p className="soft">Try next: {p.notes.tryNext}</p>}
    </div>
  );
  return null;
}

// Shown while the coach is thinking: the mascot bobs and the line changes.
const LINES_FIRST = ['Reading your notes…', 'Looking at your goals…', 'Thinking…'];
const LINES = ['Thinking…', 'Hmm…', 'Nearly there…'];
function Thinking({ first }) {
  const lines = first ? LINES_FIRST : LINES;
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % lines.length), 1400); return () => clearInterval(t); }, [lines.length]);
  return (
    <div className="msg assistant thinking" aria-live="polite">
      <img src={think} alt="" className="msg-face bob" />
      <div className="msg-body"><p>{lines[i]}</p><span className="dots"><i /><i /><i /></span></div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import think from '../assets/mascot-think.png';
import { askCoach, buildPlayerFile } from '../coach.js';

// A conversation with the AI coach in one mode. When the coach suggests something
// (a level, a goal, notes), the player taps Accept or Not quite. Nothing is saved without that tap.
export default function CoachChat({ mode, title, vars = {}, player, skill, onProposal, onClose, opener, intro }) {
  const [msgs, setMsgs] = useState(intro ? [{ role: 'assistant', content: intro }] : []); // { role, content, proposal? }
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
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
      });
      const reply = out.reply || [out.title, out.body].filter(Boolean).join('. ') || '…';
      // Sources are listed under the answer, so tidy inline links like [fipadel.com](https://...) to plain words.
      const clean = reply.replace(/\(?\[([^\]]+)\]\((https?:[^)]+)\)\)?/g, '').replace(/ +([.,])/g, '$1').trim();
      setMsgs([...next, { role: 'assistant', content: clean || reply, proposal: out.proposal || null, sources: out.sources || [] }]);
    } catch (e) {
      setError(String(e.message || e));
    }
    setBusy(false);
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!intro) send(opener || null, []);
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, busy]);

  const accept = (i, p) => { setDone({ ...done, [i]: 'accepted' }); onProposal?.(p); };
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
              {m.sources?.length > 0 && (
                <p className="sources">Sources: {m.sources.map((src, k) => (
                  <React.Fragment key={src.url}>{k ? ', ' : ''}<a href={src.url} target="_blank" rel="noopener noreferrer">{src.title.length > 40 ? new URL(src.url).hostname.replace(/^www\./, '') : src.title}</a></React.Fragment>
                ))}</p>
              )}
              {m.proposal && (
                <div className="proposal">
                  <ProposalText p={m.proposal} />
                  {!done[i] ? (
                    <div className="session-actions">
                      <button className="mini on" onClick={() => accept(i, m.proposal)}>Accept</button>
                      <button className="mini" onClick={() => decline(i)}>Not quite</button>
                    </div>
                  ) : <p className="soft">{done[i] === 'accepted' ? 'Saved.' : 'OK, let\'s adjust.'}</p>}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && <Thinking first={msgs.filter((m) => m.role === 'assistant').length === 0} />}
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

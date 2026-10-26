import React, { useEffect, useRef, useState } from 'react';
import think from '../assets/mascot-think.png';
import { askCoach, buildPlayerFile } from '../coach.js';

// A conversation with the AI coach in one mode. When the coach suggests something
// (a level, a goal, notes), the player taps Accept or Not quite. Nothing is saved without that tap.
export default function CoachChat({ mode, title, vars = {}, player, skill, onProposal, onClose, opener }) {
  const [msgs, setMsgs] = useState([]); // { role, content, proposal? }
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
      setMsgs([...next, { role: 'assistant', content: reply, proposal: out.proposal || null }]);
    } catch (e) {
      setError(String(e.message || e));
    }
    setBusy(false);
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    send(opener || null, []);
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
      {msgs.length === 0 && !busy && !error && <p className="soft">Starting…</p>}
      <div className="chat">
        {msgs.map((m, i) => (
          <div key={i} className={'msg ' + m.role}>
            {m.role === 'assistant' && <img src={think} alt="" className="msg-face" />}
            <div className="msg-body">
              <p>{m.content}</p>
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
        {busy && <div className="msg assistant"><img src={think} alt="" className="msg-face" /><div className="msg-body"><p className="typing">…</p></div></div>}
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

import React, { useState } from 'react';
import { goalSkill, goalNote, goalLine } from '../goals.js';
import CoachChat from '../components/CoachChat.jsx';
import { allSkillById as skillById, axisById, whenLabel } from '../data.js';

// For players who never gave a level: a short list of common weak spots, or your own words. No level, no long skill list.
const SPOTS = ['second_serve', 'return_of_serve', 'volley_backhand', 'bandeja', 'smash', 'defensive_lob', 'net_play', 'composure'];

export default function Goals({ player, updatePlayer, onAdd, simple = false }) {
  const [picking, setPicking] = useState(false);
  const [own, setOwn] = useState('');
  const addGoal = (g) => { updatePlayer((p) => ({ ...p, goals: [...(p.goals || []), { id: 'g' + Date.now(), progress: 30, created: new Date().toISOString(), ...g }] })); setPicking(false); setOwn(''); };
  const goals = player.goals || [];
  const [removing, setRemoving] = useState(null);
  const [editing, setEditing] = useState(null); // goal id being detailed
  const [coaching, setCoaching] = useState(null); // goal id talking to the coach
  const [draft, setDraft] = useState({ now: '', want: '' });
  const setDetail = (id, d) => updatePlayer((p) => ({ ...p, goals: p.goals.map((g) => (g.id === id ? { ...g, ...d } : g)) }));
  const setProgress = (id, v) => updatePlayer((p) => ({ ...p, goals: p.goals.map((g) => (g.id === id ? { ...g, progress: v } : g)) }));
  const remove = (id) => { updatePlayer((p) => ({ ...p, goals: p.goals.filter((g) => g.id !== id) })); setRemoving(null); };
  const recent = (id) => (player.sessions || [])
    .filter((s) => s.goalChecks?.[id])
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 5)
    .map((s) => s.goalChecks[id]);
  const mark = { better: '▲', same: '●', struggling: '▼' };

  return (
    <main className="page">
      <section className="panel">
        <p className="eyebrow">Your goals</p>
        <p className="soft">Up to 3 at a time. The % is how happy you are with it, not your level.</p>
        {goals.length === 0 ? (
          <p className="insight">No goals yet.</p>
        ) : (
          <ul className="goals">
            {goals.map((g) => {
              const skill = skillById[g.skillId];
              const r = recent(g.id);
              return (
                <li key={g.id} className="goal">
                  <div className="goal-top"><span className="goal-title">{goalSkill(g)}</span><span className="goal-pct">{g.progress}%</span></div>
                  {goalNote(g) && <p className="goal-note">{goalNote(g)}</p>}
                  {skill && (
                    <p className="goal-skill">
                      {axisById[skill.axis].name}
                      {g.diagnosis?.when && g.diagnosis.when !== 'unsure' && whenLabel(skill, g.diagnosis.when) ? ` · mostly ${whenLabel(skill, g.diagnosis.when).replace(/^(?!I\b)./, (c) => c.toLowerCase())}` : ''}
                    </p>
                  )}
                  {(g.now || g.want) && editing !== g.id && (
                    <div className="goal-detail">
                      {g.now && <p className="soft"><strong>Now:</strong> {g.now}</p>}
                      {g.want && <p className="soft"><strong>I want:</strong> {g.want}</p>}
                    </div>
                  )}
                  {editing === g.id && (
                    <div className="ob-form">
                      <label className="soft">How is it now? What happens?
                        <input value={draft.now} maxLength={120} placeholder="e.g. Soft and loops up" onChange={(e) => setDraft({ ...draft, now: e.target.value })} />
                      </label>
                      <label className="soft">What do you want instead?
                        <input value={draft.want} maxLength={120} placeholder="e.g. Faster, towards the side glass" onChange={(e) => setDraft({ ...draft, want: e.target.value })} />
                      </label>
                      <button className="btn" onClick={() => { setDetail(g.id, { now: draft.now.trim(), want: draft.want.trim() }); setEditing(null); }}>Save</button>
                      <button className="mini quiet" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  )}
                  {editing !== g.id && coaching !== g.id && (
                    <div className="row-gap">
                      <button className="mini" onClick={() => { setDraft({ now: g.now || '', want: g.want || '' }); setEditing(g.id); }}>{g.now || g.want ? 'Edit details' : 'Add the how and why'}</button>
                      <button className="mini" onClick={() => setCoaching(g.id)}>Work it out with the coach</button>
                    </div>
                  )}
                  {coaching === g.id && (
                    <CoachChat
                      mode="goal_diagnose"
                      title={`Coach: ${goalSkill(g)}`}
                      intro={g.now || g.want ? `Let's tighten up this goal: "${goalSkill(g)}". What's still missing?` : `Let's pin down this goal: "${goalSkill(g)}". How does it go for you in matches right now?`}
                      vars={{ skill_name: goalSkill(g), skill_id: g.skillId || '' }}
                      player={player}
                      skill={g.skillId ? skill : undefined}
                      onClose={() => setCoaching(null)}
                      onProposal={(pr) => { if (pr.type === 'goal_detail') setDetail(g.id, { now: String(pr.now || '').slice(0, 120), want: String(pr.want || '').slice(0, 120) }); }}
                    />
                  )}
                  <input type="range" min="0" max="100" step="5" value={g.progress} onChange={(e) => setProgress(g.id, Number(e.target.value))} aria-label={`How happy you are with: ${goalLine(g)}`} className="slider" />
                  {r.length > 0 && <p className="soft">Last sessions: {r.map((x) => ({ better: 'Better', same: 'Same', struggling: 'Still struggling' })[x]).join(' · ')}</p>}
                  {removing === g.id
                    ? <button className="mini" onClick={() => remove(g.id)}>Tap again to remove</button>
                    : <button className="mini quiet" onClick={() => setRemoving(g.id)}>Remove</button>}
                </li>
              );
            })}
          </ul>
        )}
        {goals.length < 3 && !picking && <button className="btn" onClick={simple ? () => setPicking(true) : onAdd}>{simple ? '+ Pick one thing to work on' : '+ Choose a skill to work on'}</button>}
        {picking && (
          <div className="ob-form">
            <p className="eyebrow">What's one thing to work on?</p>
            <div className="chips">
              {SPOTS.filter((id) => skillById[id] && !goals.some((g) => g.skillId === id)).map((id) => <button key={id} className="chip-btn skill" onClick={() => addGoal({ skillId: id, title: '' })}>{skillById[id].name}</button>)}
            </div>
            <label className="soft">Or in your own words
              <input value={own} maxLength={60} placeholder="e.g. Stay calm at 30-40" onChange={(e) => setOwn(e.target.value)} />
            </label>
            <button className="btn" disabled={!own.trim()} onClick={() => addGoal({ own: true, title: own.trim() })}>Save</button>
            <button className="mini quiet" onClick={() => setPicking(false)}>Cancel</button>
          </div>
        )}
        <p className="soft">{simple ? 'One thing is plenty. You can change it any time.' : 'Goals start from a skill. Pick one, then tap "Make this a goal".'}</p>
      </section>
    </main>
  );
}

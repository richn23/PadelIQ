import React, { useState } from 'react';
import { allSkillById as skillById, axisById } from '../data.js';

export default function Goals({ player, updatePlayer }) {
  const goals = player.goals || [];
  const [removing, setRemoving] = useState(null);
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
                  <div className="goal-top"><span className="goal-title">{g.title}</span><span className="goal-pct">{g.progress}%</span></div>
                  {skill && <p className="goal-skill">{skill.name} · {axisById[skill.axis].name}</p>}
                  <input type="range" min="0" max="100" step="5" value={g.progress} onChange={(e) => setProgress(g.id, Number(e.target.value))} aria-label={`How happy you are with: ${g.title}`} className="slider" />
                  {r.length > 0 && <p className="soft">Last sessions: {r.map((x) => mark[x]).join(' ')} <span className="legend">(▲ better ● same ▼ struggling)</span></p>}
                  {removing === g.id
                    ? <button className="mini" onClick={() => remove(g.id)}>Tap again to remove</button>
                    : <button className="mini quiet" onClick={() => setRemoving(g.id)}>Remove</button>}
                </li>
              );
            })}
          </ul>
        )}
        <p className="soft">To add a goal, open a skill on the Skills tab and tap "Make this a goal".</p>
      </section>
    </main>
  );
}

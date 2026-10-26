import React, { useState } from 'react';
import { goalSkill, goalNote, goalLine } from '../goals.js';
import { allSkillById as skillById, axisById, goalDiagnosis as gd } from '../data.js';

export default function Goals({ player, updatePlayer, onAdd }) {
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
                  <div className="goal-top"><span className="goal-title">{goalSkill(g)}</span><span className="goal-pct">{g.progress}%</span></div>
                  {goalNote(g) && <p className="goal-note">{goalNote(g)}</p>}
                  {skill && (
                    <p className="goal-skill">
                      {axisById[skill.axis].name}
                      {g.diagnosis?.when && g.diagnosis.when !== 'unsure' ? ` · mostly ${([...gd.when, ...Object.values(gd.whenOverrides?.replace || {})].find((w) => w.id === g.diagnosis.when))?.label.replace(/^./, (c) => c.toLowerCase())}` : ''}
                    </p>
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
        {goals.length < 3 && <button className="btn" onClick={onAdd}>+ Choose a skill to work on</button>}
        <p className="soft">Goals start from a skill. Pick one, then tap "Make this a goal".</p>
      </section>
    </main>
  );
}

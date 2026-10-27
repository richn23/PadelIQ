import React, { useRef, useState } from 'react';
import { levels, themes } from '../data.js';
import { currentLevel, levelName, overallLevel, currentAxisLevels } from '../levels.js';
import { applyTheme, pickTheme } from '../theme.js';
import { CHECKIN_EVERY } from '../sessions.js';
import { MODES, modeOf } from '../modes.js';

export default function Settings({ player, updatePlayer, onRedoQuiz, onReset, onBack }) {
  const [theme, setTheme] = useState(pickTheme());
  const [pickLevel, setPickLevel] = useState(false);
  const [sureReset, setSureReset] = useState(false);
  const [sureRedo, setSureRedo] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef(null);
  const every = player.checkInEvery || CHECKIN_EVERY;
  const fromSkills = overallLevel(currentAxisLevels(player));
  const mode = modeOf(player);
  const full = mode === 'full';
  // Going to the full picture needs the skills check once, if you skipped it.
  const setMode = (id) => {
    if (id === mode) return;
    if (id === 'full' && !player.quiz) { onRedoQuiz(); return; }
    updatePlayer((p) => ({ ...p, mode: id }));
  };

  const exportData = async () => {
    const blob = new Blob([JSON.stringify(player, null, 2)], { type: 'application/json' });
    const name = `padel-iq-backup-${new Date().toISOString().slice(0, 10)}.json`;
    // On phones, use the Share menu (save to Files, send to yourself...). Otherwise download.
    try {
      const file = new File([blob], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Padel IQ backup' });
        updatePlayer((p) => ({ ...p, lastBackup: new Date().toISOString() }));
        setMsg('Backup shared.');
        return;
      }
    } catch { /* fall back to download */ }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    updatePlayer((p) => ({ ...p, lastBackup: new Date().toISOString() }));
    setMsg('Backup saved to your downloads.');
  };
  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((t) => {
      try {
        const data = JSON.parse(t);
        if (!data.axisLevels) throw new Error('not a Padel IQ backup');
        updatePlayer(() => data);
        setMsg('Backup loaded.');
      } catch {
        setMsg("That file isn't a Padel IQ backup.");
      }
    });
  };

  return (
    <main className="page">
      <button className="back" onClick={onBack}>‹ {mode === 'fun' ? 'Games' : 'Home'}</button>

      <section className="panel ob-form">
        <p className="eyebrow">You</p>
        <label className="soft">Your name
          <input value={player.name} maxLength={20} onChange={(e) => updatePlayer((p) => ({ ...p, name: e.target.value }))} onBlur={() => updatePlayer((p) => ({ ...p, name: p.name.trim() || 'Player' }))} />
        </label>
      </section>

      <section className="panel">
        <p className="eyebrow">How you use Padel IQ</p>
        <div className="ob-answers" style={{ marginTop: 8 }}>
          {MODES.map((m) => (
            <button key={m.id} className={`ans level-pick${mode === m.id ? ' picked' : ''}`} onClick={() => setMode(m.id)}>
              <strong>{mode === m.id ? '✓ ' : ''}{m.name}</strong>
              <span>{m.text}</span>
            </button>
          ))}
        </div>
        <p className="soft">Your games and goals are kept when you switch.{!player.quiz && !full ? ' The full picture starts with a quick skills check.' : ''}</p>
      </section>

      {full && <section className="panel">
        <div className="row-between"><p className="eyebrow">Your level</p><p className="pill">{levelName(currentLevel(player))}</p></div>
        <p className="soft">
          {player.levelSetByPlayer ? 'You set this yourself.' : Object.keys(player.skillChecks || {}).length ? 'Worked out from your skill checks.' : 'From your quiz.'}
          {player.levelSetByPlayer && fromSkills !== player.level ? ` From your answers it would be ${levelName(fromSkills)}.` : ''}
        </p>
        {!pickLevel ? (
          <div className="session-actions" style={{ marginTop: 10 }}>
            <button className="mini" onClick={() => setPickLevel(true)}>Set it myself</button>
            {player.levelSetByPlayer && <button className="mini" onClick={() => updatePlayer((p) => ({ ...p, levelSetByPlayer: false }))}>Use my skills</button>}
          </div>
        ) : (
          <div className="chips" style={{ marginTop: 10 }}>
            {levels.filter((l) => l.assessable).map((l) => (
              <button key={l.id} className="chip-btn skill" onClick={() => { updatePlayer((p) => ({ ...p, level: l.id, levelSetByPlayer: true })); setPickLevel(false); }}>{l.name}</button>
            ))}
          </div>
        )}
      </section>}

      {full && <section className="panel">
        <p className="eyebrow">Check-in</p>
        <div className="row-between" style={{ marginTop: 6 }}>
          <span>Every {every} sessions</span>
          <span className="session-actions">
            <button className="mini" disabled={every <= 5} onClick={() => updatePlayer((p) => ({ ...p, checkInEvery: Math.max(5, every - 1) }))}>−</button>
            <button className="mini" disabled={every >= 20} onClick={() => updatePlayer((p) => ({ ...p, checkInEvery: Math.min(20, every + 1) }))}>+</button>
          </span>
        </div>
        <p className="soft">Minimum 5. Matches and lessons both count.</p>
      </section>}

      <section className="panel">
        <p className="eyebrow">Court colour</p>
        <div className="segmented" style={{ marginTop: 8 }}>
          {Object.keys(themes).map((id) => (
            <button key={id} className={theme === id ? 'on' : ''} onClick={() => { applyTheme(id); setTheme(id); }}>{id[0].toUpperCase() + id.slice(1)}</button>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Backup</p>
        <p className="soft">Your data lives only on this phone. Save a backup now and then. It only takes a moment.</p>
        <div className="session-actions" style={{ marginTop: 10 }}>
          <button className="mini on" onClick={exportData}>Save a backup</button>
          <button className="mini" onClick={() => fileRef.current?.click()}>Load a backup</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importData} />
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Start over</p>
        <div className="session-actions" style={{ marginTop: 10 }}>
          {full && (!sureRedo ? <button className="mini" onClick={() => setSureRedo(true)}>Redo the quiz</button> : <button className="mini on" onClick={onRedoQuiz}>Tap again to start the quiz</button>)}
          {!sureReset ? <button className="mini" onClick={() => setSureReset(true)}>Delete everything</button> : <button className="mini danger" onClick={onReset}>Tap again: delete all</button>}
        </div>
        {full && <p className="soft">Redoing the quiz keeps your matches, goals and skill checks.</p>}
      </section>
      <section className="panel">
        <p className="eyebrow">For coaches</p>
        <p className="soft">Not needed for playing. See and edit every skill, level and statement. Best on a laptop.</p>
        <div className="session-actions" style={{ marginTop: 10 }}>
          <a className="mini" href="?admin">Open the skills framework</a>
        </div>
      </section>
      {msg && <p className="soft center">{msg}</p>}
    </main>
  );
}

import React from 'react';
import { backupDue } from '../goals.js';

// A gentle monthly reminder: everything lives only in this browser.
export default function BackupNudge({ player, updatePlayer, onSettings }) {
  if (!backupDue(player)) return null;
  return (
    <section className="panel center">
      <p className="insight">Save a backup</p>
      <p className="soft">Your games and goals live only on this phone. A quick backup keeps them safe.</p>
      <div className="row-gap" style={{ justifyContent: 'center' }}>
        <button className="mini on" onClick={onSettings}>Save a backup</button>
        <button className="mini quiet" onClick={() => updatePlayer((p) => ({ ...p, backupSnooze: new Date().toISOString() }))}>Later</button>
      </div>
    </section>
  );
}

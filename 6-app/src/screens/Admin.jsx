import React, { useEffect, useMemo, useState } from 'react';
import frameworkFile from '../../../5-data/framework.json';
import glossaryFile from '../../../5-data/skills-glossary.json';
import goalFile from '../../../5-data/goal-diagnosis.json';
import fixesFile from '../../../5-data/warning-fixes.json';
import csvRaw from '../../../2-framework/framework-v3/padel-iq-skills.csv?raw';
import '../admin.css';

// Admin: the skills framework as one editable list, to review with a coach.
// Edits are kept in this browser until you download the files and put them in 5-data.

const KEY = 'padeliq-admin-draft';
const LEVELS = frameworkFile.levels.filter((l) => l.id !== 'Pro');
const AXES = frameworkFile.axes;
const GROUPS = glossaryFile.groups;
const STATUS = [
  { id: 'draft', label: 'Draft' },
  { id: 'needs_work', label: 'Needs work' },
  { id: 'reviewed', label: 'Reviewed' },
];
const groupName = (id) => GROUPS.find((g) => g.id === id)?.name || id;
const axisName = (id) => AXES.find((a) => a.id === id)?.name || id;
const levelName = (id) => LEVELS.find((l) => l.id === id)?.name || id;
const clone = (x) => JSON.parse(JSON.stringify(x));

// Which goal-question list a skill uses (for information only).
const TYPE_NAMES = { serve: 'Serve', control_overhead: 'Control overheads', smash: 'Smashes', bajada: 'Bajada', volley: 'Volleys', touch: 'Touch shots', return: 'Return of serve', ground: 'Forehand and backhand', lob: 'Lobs', glass: 'Glass shots', smash_defence: 'Defending a smash', passing: 'Passing shot' };
const goalTypeOf = Object.fromEntries(Object.entries(goalFile.skillTypes || {}).flatMap(([k, t]) => t.skills.map((id) => [id, k])));

function original() {
  return { items: clone(glossaryFile.items), skills: clone(frameworkFile.skills) };
}
function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d?.items && d?.skills) return d; } catch { /* ignore */ }
  return original();
}

const firstLevel = (fw) => LEVELS.find((l) => fw?.levels?.[l.id]?.master)?.id || null;
const optionalSkill = (fw) => !!fw && Object.values(fw.levels || {}).length > 0 && Object.values(fw.levels).every((v) => v.optional);

function download(name, text, type) {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

const CSV_GROUP = { attacking: 'Attacking shots', defensive: 'Defensive shots', transition: 'Transition shots', specialist: 'Specialist shots', movement: 'Movement', tactics: 'Tactics and teamwork', mentality: 'Mentality' };

// Small CSV reader (quotes, commas and line breaks inside cells).
function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((x) => x.trim()));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), r[i] ?? ''])));
}

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export default function Admin() {
  const [data, setData] = useState(load);
  const [open, setOpen] = useState({});
  const [q, setQ] = useState('');
  const [area, setArea] = useState('all');
  const [status, setStatus] = useState('all');
  const base = useMemo(original, []);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ } }, [data]);

  const fwById = Object.fromEntries(data.skills.map((s) => [s.id, s]));
  const changed = (id) => {
    const a = data.items.find((i) => i.id === id), b = base.items.find((i) => i.id === id);
    return JSON.stringify(a) !== JSON.stringify(b) || JSON.stringify(fwById[id]) !== JSON.stringify(base.skills.find((s) => s.id === id));
  };
  const changedCount = data.items.filter((i) => changed(i.id)).length;

  // ---- editing helpers ----
  const setItem = (id, patch) => setData((d) => ({ ...d, items: d.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  const setSkill = (id, fn) => setData((d) => {
    const exists = d.skills.some((s) => s.id === id);
    const item = d.items.find((i) => i.id === id);
    const blank = { id, axis: item.area, name: item.name, levels: {}, statements: [], warnings: [] };
    const skills = exists ? d.skills.map((s) => (s.id === id ? fn(clone(s)) : s)) : [...d.skills, fn(blank)];
    return { ...d, skills };
  });
  const review = (id) => data.items.find((i) => i.id === id)?.review || { status: 'draft', notes: '' };

  // ---- filters ----
  const list = data.items.filter((i) => {
    if (area !== 'all' && i.area !== area) return false;
    if (status !== 'all' && (i.review?.status || 'draft') !== status) return false;
    if (!q.trim()) return true;
    const hay = JSON.stringify([i, fwById[i.id]]).toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });
  const byGroup = GROUPS.map((g) => ({ g, items: list.filter((i) => i.group === g.id) })).filter((x) => x.items.length);
  const counts = STATUS.map((s) => ({ ...s, n: data.items.filter((i) => (i.review?.status || 'draft') === s.id).length }));

  // ---- downloads ----
  // Save in the format the importer reads: the framework spreadsheet plus the goal wording file.
  // Put both in the repo (2-framework/framework-v3/ and 5-data/) and push: the build re-imports them.
  const saveFiles = () => {
    const orig = parseCSV(csvRaw.replace(/^\ufeff/, ''));
    const head = Object.keys(orig[0] || {});
    ['Quick check', 'App ID'].forEach((h) => { if (!head.includes(h)) head.push(h); });
    const byRecord = Object.fromEntries(orig.map((r) => [r['Record ID'], r]));
    const out = [];
    data.items.forEach((i) => {
      const fw = fwById[i.id] || { levels: {}, statements: [], warnings: [] };
      const r = i.review || {};
      const common = {
        Area: axisName(i.area), Category: CSV_GROUP[i.group] || groupName(i.group), Skill: i.name, Spanish: i.es || '', 'Also called': i.aka || '',
        Definition: i.what || '', 'When to use it': i.when || '', 'Review status': STATUS.find((x) => x.id === (r.status || 'draft')).label,
        Notes: r.notes || '', 'Quick check': i.key ? 'Yes' : 'No', 'App ID': i.id, 'Record type': fw.recordType || 'Player competency',
      };
      const lvs = LEVELS.filter((l) => fw.levels?.[l.id]);
      if (!lvs.length) {
        // Optional rescue shots: no levels, keep their original rows.
        orig.filter((o) => o['App ID'] === i.id || o.Skill === i.name).forEach((o) => out.push({ ...o, ...common, Level: o.Level || 'Optional', Optional: 'Yes' }));
        return;
      }
      lvs.forEach((l) => {
        const lv = fw.levels[l.id];
        const base = byRecord[lv.recordId] || {};
        out.push({
          ...base, ...common,
          Level: l.name, 'Expected at this level': lv.master ? 'Yes' : lv.optional ? 'Optional' : 'No', 'What it looks like': lv.text || '',
          'Statements (I can...)': (fw.statements || []).filter((st) => st.level === l.id && st.text.trim()).map((st) => st.text.trim()).join('\n'),
          'Warning questions': (fw.warnings || []).filter((w) => w.level === l.id && w.text.trim()).map((w) => w.text.trim()).join('\n'),
          'Record ID': lv.recordId || `${i.id}-${l.name}`, Optional: lv.optional ? 'Yes' : 'No',
        });
      });
    });
    const csv = '\ufeff' + [head, ...out.map((row) => head.map((h) => row[h] ?? ''))].map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
    const fixes = { ...fixesFile };
    data.skills.forEach((sk) => (sk.warnings || []).forEach((w) => { if (w.text.trim()) fixes[w.text.trim()] = { ...(fixes[w.text.trim()] || {}), fix: w.fix || '', ...(w.invert ? { invert: true } : {}) }; }));
    download('padel-iq-skills.csv', csv, 'text/csv');
    setTimeout(() => download('warning-fixes.json', JSON.stringify(fixes, null, 2) + '\n', 'application/json'), 400);
  };
  const saveSheet = () => {
    const head = ['Area', 'Category', 'Skill', 'Spanish', 'Also called', 'Definition', 'When to use it', 'Level', 'Expected at this level', 'What it looks like', 'Statements (I can...)', 'Warning questions', 'Review status', 'Notes'];
    const rows = [head];
    data.items.forEach((i) => {
      const fw = fwById[i.id] || { levels: {}, statements: [], warnings: [] };
      const r = i.review || {};
      const lv = LEVELS.filter((l) => fw.levels[l.id] || fw.statements.some((s) => s.level === l.id));
      (lv.length ? lv : [{ id: '' }]).forEach((l) => rows.push([
        axisName(i.area), groupName(i.group), i.name, i.es, i.aka, i.what, i.when,
        l.id ? levelName(l.id) : '', fw.levels[l.id]?.master ? 'Yes' : fw.levels[l.id]?.optional ? 'Optional' : '', fw.levels[l.id]?.text || '',
        fw.statements.filter((s) => s.level === l.id).map((s) => s.text).join('\n'),
        (fw.warnings || []).filter((w) => w.level === l.id).map((w) => w.text).join('\n'),
        STATUS.find((s) => s.id === (r.status || 'draft')).label, r.notes || '',
      ]));
    });
    download('padel-iq-skills.csv', '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\n'), 'text/csv');
  };
  const reset = () => { if (window.confirm('Throw away all your edits and go back to the saved framework?')) { setData(original()); setOpen({}); } };
  const expandAll = (v) => setOpen(v ? Object.fromEntries(list.map((i) => [i.id, true])) : {});

  return (
    <div className="admin">
      <header className="ad-head">
        <div>
          <h1>Skills framework</h1>
          <p className="ad-soft">{data.items.length} skills · {counts.map((c) => `${c.n} ${c.label.toLowerCase()}`).join(' · ')}{changedCount ? ` · ${changedCount} edited` : ''}</p>
        </div>
        <div className="ad-actions">
          <button onClick={saveSheet}>Download spreadsheet</button>
          <button onClick={() => { expandAll(true); setTimeout(() => window.print(), 300); }}>Print</button>
          <button className="primary" onClick={saveFiles} disabled={!changedCount}>Download framework files</button>
          <button className="ghost" onClick={reset} disabled={!changedCount}>Undo all edits</button>
          <a className="ghost" href="./">Back to app</a>
        </div>
      </header>

      {changedCount > 0 && (
        <p className="ad-note">Your edits are saved in this browser only. To use them in the app, tap Download framework files, then replace <code>2-framework/framework-v3/padel-iq-skills.csv</code> and <code>5-data/warning-fixes.json</code> in the repo and push. The app rebuilds from them.</p>
      )}

      <div className="ad-filters">
        <input type="search" placeholder="Search skills, statements, notes…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={area} onChange={(e) => setArea(e.target.value)} aria-label="Area">
          <option value="all">All areas</option>
          {AXES.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Review status">
          <option value="all">Any status</option>
          {STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <button className="ghost" onClick={() => expandAll(true)}>Open all</button>
        <button className="ghost" onClick={() => expandAll(false)}>Close all</button>
      </div>

      {byGroup.map(({ g, items }) => (
        <section key={g.id} className="ad-group">
          <h2>{g.name} <span className="ad-soft">({items.length})</span></h2>
          {g.note && <p className="ad-soft">{g.note}</p>}
          <div className="ad-row ad-row-head" aria-hidden="true">
            <span>Skill</span><span>Area</span><span>Starts at</span><span>Definition</span><span>Statements</span><span>Status</span>
          </div>
          {items.map((i) => {
            const fw = fwById[i.id];
            const r = review(i.id);
            const isOpen = !!open[i.id];
            return (
              <article key={i.id} className={`ad-skill${isOpen ? ' open' : ''}`}>
                <button className="ad-row" onClick={() => setOpen({ ...open, [i.id]: !isOpen })} aria-expanded={isOpen}>
                  <span className="ad-name"><strong>{i.name}</strong>{i.key && <span className="ad-key" title="In the quick check">key</span>}{i.es && i.es !== i.name ? <em> · {i.es}</em> : null}{changed(i.id) && <span className="ad-dot" title="Edited">edited</span>}</span>
                  <span>{axisName(i.area)}</span>
                  <span>{firstLevel(fw) ? levelName(firstLevel(fw)) : optionalSkill(fw) ? <span className="ad-soft">Optional</span> : <span className="ad-soft">Not checked</span>}</span>
                  <span className="ad-def">{i.what}</span>
                  <span>{fw?.statements?.length || 0}</span>
                  <span><span className={`ad-status ${r.status || 'draft'}`}>{STATUS.find((s) => s.id === (r.status || 'draft')).label}</span></span>
                </button>
                {isOpen && <Editor item={i} fw={fw} review={r} setItem={setItem} setSkill={setSkill} />}
              </article>
            );
          })}
        </section>
      ))}
      {!byGroup.length && <p className="ad-soft">Nothing matches.</p>}
    </div>
  );
}

function Field({ label, children, wide }) {
  return <label className={`ad-field${wide ? ' wide' : ''}`}><span>{label}</span>{children}</label>;
}

function Editor({ item, fw, review, setItem, setSkill }) {
  const id = item.id;
  const s = fw || { levels: {}, statements: [], warnings: [] };
  const newId = (prefix) => {
    const used = new Set([...(s.statements || []), ...(s.warnings || [])].map((x) => x.id));
    let n = 1; while (used.has(`${id}_${prefix}${n}`)) n += 1;
    return `${id}_${prefix}${n}`;
  };
  const setLevel = (lv, patch) => setSkill(id, (x) => { x.levels[lv] = { ...(x.levels[lv] || { master: false, text: '' }), ...patch, source: 'richard' }; if (!x.levels[lv].text && !x.levels[lv].master && !x.levels[lv].optional) delete x.levels[lv]; return x; });
  const setStmt = (sid, text) => setSkill(id, (x) => { x.statements = x.statements.map((st) => (st.id === sid ? { ...st, text, source: 'richard' } : st)); return x; });
  const delStmt = (sid) => setSkill(id, (x) => { x.statements = x.statements.filter((st) => st.id !== sid); return x; });
  const addStmt = (lv) => setSkill(id, (x) => { x.statements = [...(x.statements || []), { id: newId('s'), level: lv, text: '', source: 'richard' }]; return x; });
  const setWarn = (wid, patch) => setSkill(id, (x) => { x.warnings = (x.warnings || []).map((w) => (w.id === wid ? { ...w, ...patch, source: 'richard' } : w)); return x; });
  const delWarn = (wid) => setSkill(id, (x) => { x.warnings = (x.warnings || []).filter((w) => w.id !== wid); return x; });
  const addWarn = (lv) => setSkill(id, (x) => { x.warnings = [...(x.warnings || []), { id: newId('w'), level: lv, text: '', fix: '', source: 'richard' }]; return x; });

  return (
    <div className="ad-editor">
      <div className="ad-grid">
        <Field label="Name"><input value={item.name} onChange={(e) => setItem(id, { name: e.target.value })} /></Field>
        <Field label="Spanish name"><input value={item.es || ''} onChange={(e) => setItem(id, { es: e.target.value })} /></Field>
        <Field label="Also called (for search)"><input value={item.aka || ''} onChange={(e) => setItem(id, { aka: e.target.value })} /></Field>
        <Field label="Category">
          <select value={item.group} onChange={(e) => setItem(id, { group: e.target.value })}>{GROUPS.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
        </Field>
        <Field label="Area (pentagon)">
          <select value={item.area} onChange={(e) => setItem(id, { area: e.target.value })}>{AXES.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
        </Field>
        <Field label="Checked in the app">
          <select value={item.checked ? 'yes' : 'no'} onChange={(e) => setItem(id, { checked: e.target.value === 'yes' })}><option value="yes">Yes</option><option value="no">No (glossary only)</option></select>
        </Field>
        <Field label="In the quick check">
          <select value={item.key ? 'yes' : 'no'} onChange={(e) => setItem(id, { key: e.target.value === 'yes' || undefined })}><option value="yes">Yes (key skill)</option><option value="no">No (full check only)</option></select>
        </Field>
        <Field label="Definition" wide><textarea rows="2" value={item.what || ''} onChange={(e) => setItem(id, { what: e.target.value })} /></Field>
        <Field label="When to use it" wide><textarea rows="2" value={item.when || ''} onChange={(e) => setItem(id, { when: e.target.value })} /></Field>
      </div>

      <h3>Levels</h3>
      <div className="ad-levels">
        {LEVELS.map((l) => {
          const lv = s.levels?.[l.id];
          const stmts = (s.statements || []).filter((st) => st.level === l.id);
          const warns = (s.warnings || []).filter((w) => w.level === l.id);
          return (
            <div key={l.id} className={`ad-level${lv?.master ? ' expected' : ''}`}>
              <div className="ad-level-head">
                <strong>{l.name}</strong>
                <label className="ad-check"><input type="checkbox" checked={!!lv?.master} onChange={(e) => setLevel(l.id, { master: e.target.checked, optional: e.target.checked ? false : !!lv?.optional, text: lv?.text || '' })} /> Expected at this level</label>
                <label className="ad-check"><input type="checkbox" checked={!!lv?.optional} onChange={(e) => setLevel(l.id, { optional: e.target.checked, master: e.target.checked ? false : !!lv?.master, text: lv?.text || '' })} /> Optional shot (never counts)</label>
                {lv?.source && <span className="ad-src">{lv.source}</span>}
              </div>
              <div className="ad-level-body">
              <textarea rows="2" placeholder="What it looks like at this level" value={lv?.text || ''} onChange={(e) => setLevel(l.id, { text: e.target.value, master: !!lv?.master })} />
              <p className="ad-sub">Statements (player answers Always / Usually / Sometimes / Not yet)</p>
              {stmts.map((st) => (
                <div key={st.id} className="ad-line">
                  <textarea rows="1" className="ad-auto" value={st.text} placeholder="I can…" onChange={(e) => setStmt(st.id, e.target.value)} />
                  <button className="ad-x" onClick={() => delStmt(st.id)} aria-label="Delete statement">×</button>
                </div>
              ))}
              <button className="ad-add" onClick={() => addStmt(l.id)}>+ Statement</button>
              {warns.length > 0 && <p className="ad-sub">Warning questions (and the goal they suggest)</p>}
              {warns.map((w) => (
                <div key={w.id} className="ad-line two">
                  <input value={w.text} placeholder="Do you…?" onChange={(e) => setWarn(w.id, { text: e.target.value })} />
                  <input value={w.fix || ''} placeholder="Suggested goal" onChange={(e) => setWarn(w.id, { fix: e.target.value })} />
                  <button className="ad-x" onClick={() => delWarn(w.id)} aria-label="Delete warning">×</button>
                </div>
              ))}
              <button className="ad-add" onClick={() => addWarn(l.id)}>+ Warning question</button>
              </div>
            </div>
          );
        })}
      </div>

      <h3>Review</h3>
      <div className="ad-grid">
        <Field label="Status">
          <select value={review.status || 'draft'} onChange={(e) => setItem(id, { review: { ...review, status: e.target.value } })}>{STATUS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
        </Field>
        <Field label="Goal questions used"><input readOnly value={goalTypeOf[id] ? TYPE_NAMES[goalTypeOf[id]] || goalTypeOf[id] : `${groupName(item.group)} (general list)`} /></Field>
        <Field label="Notes (yours or the coach's)" wide><textarea rows="3" value={review.notes || ''} onChange={(e) => setItem(id, { review: { ...review, notes: e.target.value } })} /></Field>
      </div>
    </div>
  );
}

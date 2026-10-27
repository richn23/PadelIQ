import React, { useState } from 'react';
import { axes, levels, allSkills, onboarding as ob } from '../data.js';
import { levelOrder, levelName, notYetLevel } from '../levels.js';

// The level checklist, shared by the starting quiz and "Check the rest" on the Skills tab.
// pick = which skills to include (all, the key ones for the quick check, or the ones still to do).

export const passOf = (a) => !!ob.answers.find((o) => o.id === a)?.pass;
export const isKey = (s) => !!s.key;

// Every skill has its own description at each level. A level's checklist = the skills that
// have a (non-optional) row at that level. Optional shots never count.
const ALL = () => true;
export const rowsAt = (lv, pick = ALL) => allSkills.filter((s) => s.levels[lv]?.master && pick(s));
export const key = (skill, lv) => `${skill.id}@${lv}`;
const statementsAt = (skill, lv) => (skill.statements || []).filter((st) => st.level === lv && !st.optional).map((st) => st.text);
export const earlierLevels = (lv, pick = ALL) => levels.filter((l) => levelOrder(l.id) < levelOrder(lv) && rowsAt(l.id, pick).length);

// Answer for a row: what the player tapped, or "yes" for earlier levels they didn't open.
export const answerFor = (skill, lv, ans, current) => ans[key(skill, lv)] || (levelOrder(lv) < levelOrder(current) ? 'yes' : null);

// Starting point for every skill up to your level, saved as "from quiz": the highest level you said yes to
// (earlier levels you didn't open count as yes).
export function quizChecks(levelId, ans, pick = ALL) {
  const out = {};
  allSkills.filter(pick).forEach((s) => {
    const lvs = levels.filter((l) => levelOrder(l.id) <= levelOrder(levelId) && s.levels[l.id]?.master).map((l) => l.id);
    if (!lvs.length) return;
    let got = null;
    for (const l of lvs) { if (passOf(answerFor(s, l, ans, levelId))) got = l; else break; }
    const answer = got ? answerFor(s, got, ans, levelId) : null;
    out[s.id] = { level: got || notYetLevel(s), mode: 'quiz', ...(answer ? { answer } : {}), ...(answer === 'getting_there' ? { partial: true } : {}), date: new Date().toISOString() };
  });
  return out;
}

function SkillRow({ skill, lv, value, onChange }) {
  const lines = statementsAt(skill, lv);
  return (
    <li className="stmt">
      <p className="stmt-text"><strong>{skill.name}</strong></p>
      {lines.length > 1 ? <ul className="ican">{lines.map((t) => <li key={t}>{t}</li>)}</ul> : <p className="ican">{lines[0] || skill.levels[lv]?.text}</p>}
      <div className="seg3" role="radiogroup" aria-label={skill.name}>
        {ob.answers.map((o) => (
          <button key={o.id} role="radio" aria-checked={value === o.id} className={value === o.id ? 'on' : ''} onClick={() => onChange(o.id)}>{o.label}</button>
        ))}
      </div>
    </li>
  );
}

function Bar({ n, of }) {
  return <span className="level-bar"><span style={{ width: `${of ? (n / of) * 100 : 0}%` }} /></span>;
}

export function Checklist({ levelId, ans, setAns, pick = ALL, showEarlier = true }) {
  const [openLevel, setOpenLevel] = useState({});
  const mine = rowsAt(levelId, pick);
  const areas = axes.map((a) => ({ a, list: mine.filter((s) => s.axis === a.id) })).filter((x) => x.list.length);
  const firstOpen = areas.find((x) => x.list.some((s) => !ans[key(s, levelId)]))?.a.id || null;
  const [openArea, setOpenArea] = useState(firstOpen);
  const set = (s, lv, v) => {
    const next = { ...ans, [key(s, lv)]: v };
    setAns(next);
    // When an area is finished, open the next one that still needs answers.
    if (lv === levelId) {
      const cur = areas.find((x) => x.a.id === s.axis);
      if (cur.list.every((x) => next[key(x, levelId)])) {
        const nxt = areas.find((x) => x.list.some((y) => !next[key(y, levelId)]));
        setOpenArea(nxt ? nxt.a.id : null);
      }
    }
  };
  const answered = mine.filter((s) => ans[key(s, levelId)]).length;

  return (
    <>
      {showEarlier && earlierLevels(levelId, pick).map((l) => {
        const list = rowsAt(l.id, pick);
        const ok = list.filter((s) => passOf(answerFor(s, l.id, ans, levelId))).length;
        const isOpen = openLevel[l.id];
        return (
          <section key={l.id} className="panel level-group done">
            <button className="level-head" aria-expanded={!!isOpen} onClick={() => setOpenLevel({ ...openLevel, [l.id]: !isOpen })}>
              <span className="level-name">{levelName(l.id)}</span>
              <span className="level-score">{ok}/{list.length} {ok === list.length ? '✓' : ''}</span>
              <Bar n={ok} of={list.length} />
              <span className="chev">{isOpen ? '▾' : '▸'}</span>
            </button>
            {isOpen && (
              <ul className="stmt-list">
                {list.map((s) => <SkillRow key={s.id} skill={s} lv={l.id} value={answerFor(s, l.id, ans, levelId)} onChange={(v) => set(s, l.id, v)} />)}
              </ul>
            )}
          </section>
        );
      })}
      <div className="level-now">
        <span className="level-name">{levelName(levelId)}</span>
        <span className="level-score">{answered} of {mine.length} answered</span>
        <Bar n={answered} of={mine.length} />
      </div>
      {mine.length <= 8 && (
        <section className="panel level-group current">
          <ul className="stmt-list">
            {mine.map((s) => <SkillRow key={s.id} skill={s} lv={levelId} value={ans[key(s, levelId)]} onChange={(v) => set(s, levelId, v)} />)}
          </ul>
        </section>
      )}
      {mine.length > 8 && areas.map(({ a, list }) => {
        const done = list.filter((s) => ans[key(s, levelId)]).length;
        const isOpen = openArea === a.id;
        return (
          <section key={a.id} className={`panel level-group area${isOpen ? ' current' : ''}${done === list.length ? ' finished' : ''}`}>
            <button className="level-head" aria-expanded={isOpen} onClick={() => setOpenArea(isOpen ? null : a.id)}>
              <span className="level-name area-name">{a.name}</span>
              <span className="level-score">{done === list.length ? '✓ Done' : `${done} of ${list.length}`}</span>
              <Bar n={done} of={list.length} />
              <span className="chev">{isOpen ? '▾' : '▸'}</span>
            </button>
            {isOpen && (
              <ul className="stmt-list">
                {list.map((s) => <SkillRow key={s.id} skill={s} lv={levelId} value={ans[key(s, levelId)]} onChange={(v) => set(s, levelId, v)} />)}
              </ul>
            )}
          </section>
        );
      })}
    </>
  );
}


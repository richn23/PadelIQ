# Padel IQ: MVP data map (draft v0.9)

## What the MVP is
A personal tracker for your own games and progress. One person, no accounts. It has three parts:

1. **Framework**: the skills and levels, your profile (My Game), goals and check-ins.
2. **Reflection and journal**: Sessions, where you prepare, record and reflect on your matches and your lessons.
3. **Coach**: the AI coach, which turns your reflections into a conversation and an inbox of short tips.

The parts feed each other. The framework gives the coach something to measure against, the journal gives it evidence, and the coach helps you reflect and choose what to work on.

What each tab is for:
- **Home**: a quick look. Level, goals, next session, the latest coach insight.
- **My Game**: who you are as a player. A summary first (strengths, things to work on, patterns), then a deep dive into any area or skill.
- **Sessions**: your games and your own coaching lessons. The home of reflection.
- **Coach**: an inbox of short coach messages plus "ask a coach" (pre-match, post-match, deep dive, mindset). Part of the MVP. See `2-framework/ai-coach-design.md`.
- **More**: settings, backup, delete.

Tabs (4): Skills, Goals, Matches, Coach. Home opens after the quiz and from the logo on every screen. A coach button sits on every screen, and the Coach tab is its full screen. Matches holds lessons too.

Settled:
- After each match, each goal gets a quick check: better / same / worse.
- Journal notes are tagged by tapping skill chips. The post-match coach can suggest chips, and you confirm.
- Data lives on the phone. The MVP needs Export and Import (a backup file). The coach needs one small online helper to reach the AI safely. It only sends what each conversation needs.
- The Home card shows the latest coach insight (an inbox item), always with its evidence.
- Matches and lessons both count towards the check-in: every 5 sessions, minimum 5.
- You can log your own lessons and reflect on them (coach name as plain text, what it focused on, what the coach said, your practice task). Linking with human coaches (coach accounts, sharing, lesson prep sent to a coach) is parked for later. The AI coach stays in the MVP.
- Resources and "players to watch" are secondary and parked. The best way to add them later is through a content partner (see `2-framework/ai-coach-design.md`).

"MVP" means needed for the first version. "Later" means it can wait.

---

## 1. Screens and the data they need

### My Game

| Screen | Player sees and does | Data needed | MVP |
|---|---|---|---|
| Summary ("who I am as a player") | Pentagon. Strongest areas and skills. Most to work on. Patterns from your notes. Your goals. How long you have played | Latest skill answers, axis levels (worked out), goals, tag counts | Yes |
| One area (e.g. Defence) | Its skills with a level each, "not rated yet" gaps, "pushing ahead" skills separately, what is left to reach the next level | Skills, latest answer per skill, level checklists | Yes |
| One skill | What your level means, the next step up, rating history, linked goals, "mentioned in X notes", buttons: re-rate, make a goal | Skill descriptors, rating history, goals, tags | Yes |
| Goals | Active (max 3), Done, Parked | Goals | Yes |
| Goal detail | Objective in your own words, happiness %, status, history | Goal, goal updates, linked matches and notes | Yes |
| Add or edit goal | Pick a skill (suggestions from weak spots and the next level's checklist), write your own objective | Skills, latest answers | Yes |
| History | Timeline of ratings, goals, check-ins | All of the above, by date | Later |

### Sessions (matches and lessons)

| Screen | Player sees and does | Data needed | MVP |
|---|---|---|---|
| Sessions list | Upcoming and Past. Matches and lessons together, with a filter. A simple record (played, won, lost) for matches | Sessions | Yes |
| New lesson | Date, coach name (just text), what it focused on (tap skills), what the coach said, your practice task | Lesson details, skills | Yes |
| New match | Date, partner, opponents, venue, type (casual, competitive, league, practice). Names suggested from before | Match, names | Yes |
| Pre-match targets | Choose up to 3 from current goals | Active goals, match targets | Yes |
| Score | Sets, quick and optional | Set scores | Yes |
| Post-match goal check | One tap per goal: better, same, worse | Goal check results | Yes |
| Reflection | 3 prompts: what worked, what didn't, one thing to try. Then tap which skills came up | Journal note, skills tagged | Yes |
| Match detail | Everything above on one page | Match and its parts | Yes (simple) |

### Check-in (every 5 sessions, matches and lessons both count; you can change the number, minimum 5)

| Screen | Player sees and does | Data needed | MVP |
|---|---|---|---|
| Reminder | "Ready for a quick re-check?" Not yet / Start | Matches since last check-in, your setting | Yes |
| Questions | 1 or 2 skills per area, with your last answer beside it | Which skills to ask (goals first, longest unchecked, most tagged) | Yes |
| Before and after | Pentagon before and after, you approve | Check-in record | Yes |

### Coach (in the MVP)

| Screen | Player sees and does | Data needed | MVP |
|---|---|---|---|
| Inbox | Short coach messages, newest first, each with its evidence. Buttons: Make it a goal / Tell me more / Not now | Inbox items | Yes |
| Ask a coach | Pick a conversation: pre-match, post-match, deep dive, mindset | The list of modes | Yes |
| Conversation | A short chat. Pre-match: your 2 or 3 targets. Post-match: one question at a time, then it says back what it recorded. Deep dive and mindset: you ask, it explains | Chat messages, your evidence (goals, notes, levels) | Yes |
| Coach style | Supportive or direct | Setting | Yes |

### Home, getting started and More

| Screen | Data needed | MVP |
|---|---|---|
| Home (built) | Axis levels, active goals, next session, tag counts | Yes |
| About you (one time) | Years playing, plays per week | Yes |
| First self-check quiz (one time, placeholder questions) | Skill answers | Yes |
| Level report and first goals | Worked-out levels, new goals | Yes |
| Settings | Court colours, check-in number, coach style | Yes |
| Export and import | A backup file of everything | Yes |
| Delete my data | Clears everything | Yes |

### Parked for later
Linking with human coaches (coach accounts, lesson prep summary sent to a coach, sharing), resources through a content partner, sharing with anyone, progress timeline, practice-ideas list.

---

## 2. Things the app remembers

| Thing | What it is | What it holds |
|---|---|---|
| Player | You | Name, court colours, check-in every N sessions, coach style (supportive or direct), years playing, plays per week, date started |
| Skill answer | One answer to one skill question, with the date | Which skill, the answer picked, the level it points to, date, where from (first quiz or check-in) |
| Goal | Something you are working on | Which skill, objective in your words, happiness 0-100%, status (active, parked, done), date created, date finished |
| Goal update | One change to a goal | Which goal, date, what changed (percent, status or note), where from (session, check-in, by hand) |
| Match | A planned or played match | Date and time, venue, type (casual, competitive, league, practice), partner, opponents, planned or played, set scores (optional) |
| Match target | A goal chosen before a match | Which match, which goal (max 3) |
| Goal check | How a goal went in a match | Which match, which goal, better / same / worse |
| Journal note | Your words after a match | Which match, kind (worked / didn't work / try next), the text, where from (you, or the coach later), skills you tagged |
| Check-in | One re-check | Date, matches since the last one, skills asked, answers, pentagon before and after, approved yes/no |
| Inbox item | A short message from the coach | Type, date, which match, short text, evidence, skills, status (new / read / acted on / dismissed) |
| Chat message | One message in a coach conversation | Which conversation and mode, who said it (you or the coach), text, date, which match |

Why store answers, not just the level: if a level rule changes later, your levels can be worked out again without asking you anything.


---

## 3. Things worked out, not stored

- Area levels (pentagon): from the latest skill answers against each level's checklist
- Overall level (draft rule: the middle one of the five areas)
- Strengths: skills where your answer points above your area's level (draft rule)
- Things to work on: skills below your area's level, or gaps on the next level's checklist (draft rule)
- "Pushing ahead" skills: skills whose first level is above your level
- Matches since the last check-in
- Record: played, won, lost (context only, never used to set a level)
- "From your notes" and the patterns on My Game: counted from tagged skills, for example "3 of your last 4 notes"
- Which skills to ask at the next check-in
- Inbox items: when one should appear and what it is about (rules). The AI writes the wording

---

## 4. Still open

1. **Answer choices per skill question.** Depends on the quiz design (placeholder).
2. **Strengths and weak-spots rule.** The drafts above are guesses to test.
3. **Backup.** Export saves one file. A monthly reminder to back up is suggested.
4. **Overall level rule, "+" levels, "all or most" to pass a level.** Still marked OPEN in `framework.json`.
5. **Which coach modes come first?** Suggested: post-match and pre-match with the inbox, then deep dive and mindset right after.
6. **The online helper for the AI.** One small service that holds the AI key. Needed from the start now that the coach is in the MVP.

---

## 5. Smallest first version

Player, Skill answers, Goals (+ updates), Matches (with targets, goal checks and journal notes), Check-ins, Inbox items, Chat messages, Export/Import.

Build order inside the MVP: framework and journal first (they create the data), then the coach on top.

### Lesson (added v0.7)
| Thing | What it is | Fields |
|---|---|---|
| Lesson | A coaching lesson you log for yourself | Date, coach name (text only), focus skills (tags), what the coach said, practice task, planned or done |
Lessons get the same reflection as matches. No link to a coach account.

## Direction (Oct 2026)
- Step 1 is a personal project, shared with friends. No accounts, data stays on the phone.
- Later, maybe: booking through clubs (needs club buy-in), a content partner, human-coach linking.

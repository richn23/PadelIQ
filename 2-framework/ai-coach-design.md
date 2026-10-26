# AI Coach design (draft v0.4) - part of the MVP

Change in v0.3: resources and "players to watch" are secondary. They are parked for the first version, not thrown away. The coach explains and suggests practice but does not point to outside material yet. The best way to add resources later is through a content partner (see "Later: resources through a content partner").

## The idea
The coach is not one thing. It is built from separate layers, so any one layer can be improved without touching the others.

| Layer | What it is | Changes when you... | Where it lives |
|---|---|---|---|
| 1. Rules | Things the coach must always do or never do | Almost never | `coach/rules.md` |
| 2. Basics | What the coach always knows: how to coach well, padel basics, the app's own words for skills | Coaching ideas or padel facts are checked or improved | `coach/basics.md` |
| 3. Style | The voice: supportive or direct. Wording only, never the advice | Add or tweak a style | `coach/styles/` |
| 4. Mode | The job: pre-match, post-match, deep dive, mindset | Improve how one job works | `coach/modes/` |
| 5. Knowledge | Skills, levels, descriptors, practice ideas | Revise a descriptor, add a practice idea | `5-data/framework.json` (and a practice-ideas file later) |
| 6. Your evidence | Your own goals, matches, notes, check-ins | Every time you use the app | The app looks it up fresh each time. The AI does not "remember" it |

A reply is put together from: rules + basics + chosen style + current mode + the knowledge that applies + the evidence the app looked up.

Why it matters:
- Revise a level descriptor or add a better practice idea, and every mode improves at once.
- Add a "direct" style and the advice stays the same. Only the tone changes.
- Test it: ask the same question in both styles. The advice should match.

---

## The Coach tab: an inbox, plus "ask a coach"

- **Inbox.** Short messages from the coach, each tied to evidence, arriving after you have done something (planned a match, reflected, finished a check-in).
- **Ask a coach.** A button to start a conversation with one of the four modes. Pre-match and post-match also start from the Sessions tab at the right moment.

The key split: **post-match asks, the inbox advises.** Right after a match the coach only asks questions, so your reflection stays honest and the data stays clean. Once your notes are processed, any tips arrive later in the inbox, where you can read them when you choose.

---

## The four modes

| Mode | Its job | How it behaves | Gives advice? | Produces |
|---|---|---|---|---|
| Pre-match | Direct you before you play | Short and clear. Your 2 or 3 targets, a one-line suggestion for each, then it gets out of the way. "Tell me more" is there, but nothing extra unless you ask | Briefly, only the targets | The match targets (same as the Pre-match targets screen) |
| Post-match | Probe and collect | Curious. One question at a time. Asks you to clarify ("was it technique, position or pressure?"). Does not advise. At the end it says back what it recorded | No | Structured notes: what worked, what didn't, try next, skills tagged, goal checks. These are suggestions you confirm |
| Deep dive | Go deep when you ask | You start it: "I keep losing points on the back glass." Explains concepts in detail, suggests possible causes and level-appropriate practice. Also reviews longer-term patterns and helps you choose what to focus on next | Yes, in detail | A practice suggestion and an optional new goal |
| Mindset | The mental side | Less padel, more mentality: focus, composure, nerves at big points, bouncing back, playing ahead or behind. Asks what happens in the moment, then offers simple routines (a reset between points, a breath, a cue word). Sport mindset only, not therapy | Yes, simple and practical | A mental goal or routine to try, tagged to the Mentality skills |

Technical coach and development analyst are one mode (Deep dive) with two ways in: "I have a weakness" and "what should I focus on next?"

---

## The inbox

How it works: after you reflect, the app processes your notes (counting tagged skills, comparing with your goals) and may add one item.

| Item | When it arrives | Example |
|---|---|---|
| Match brief | Before a match | "Your targets: take the net, read the back glass. Last time you wrote: 'stay patient.'" |
| What I noticed | After a reflection | A short echo of what you said, with at most one pattern |
| Pattern | When a skill keeps coming up | "Back-glass came up in 3 of your last 4 notes." |
| Mindset tip | When mental notes repeat | "You mentioned rushing at tight scores twice. Want a routine to try?" |
| Check-in due | Every 5 sessions | "Ready for a quick re-check?" |

Every item has: a short title, one to three lines, an evidence line, and buttons: **Make it a goal**, **Tell me more** (opens Deep dive or Mindset with that topic loaded), **Not now**.

Guardrails against overload:
- At most one new item after a match, and at most three unread at once
- Items expire after about two weeks
- No red counters or streak pressure
- Detail only when you tap "Tell me more"
- You can turn item types off

In the MVP: simple rules decide when an item appears (check-in due, counted patterns, your last "try next" before a match). The AI writes the wording and the follow-up conversation.

Notes you give the post-match coach count as evidence. Your levels still only move at a check-in, and only when you approve.

---

## Later: resources through a content partner

Resources (videos, drills, articles, players to watch) are secondary. The best way to add them is a partnership with a padel learning company, not a library we build ourselves.

Why it could work:
- Their content needs to reach the right player at the right moment. This app knows the player's skill, level and goals.
- The app needs vetted, level-appropriate material. A learning company already has it.
- Their coaches could also review the level descriptors, which is the brief's "assessment validation" step.

What it would need:
- Their lessons and drills tagged with our skill ids and level ranges (a simple mapping table)
- Permission to link to, or embed, their content
- A clear deal (for example referral, or a bundle)
- Player privacy kept: nothing about a player is shared without their say-so

Honesty rules if it happens:
- Partner content is clearly labelled ("From <partner>")
- Each suggestion shows why ("you are working on back-glass at C")
- The coach still never invents a link or a claim. It only uses items the partner supplied
- Free or neutral options are not hidden

A sensible order:
1. Use the app yourself for 4 to 8 weeks.
2. Collect early evidence (goals finished, notes kept).
3. Approach with a one-page pitch and the screens, offering a small pilot: map about 20 of their lessons to skills.
4. Agree terms before using any partner name or branding in the app.

Cheap preparation now: an optional "learn more" slot on each skill in `framework.json`, empty for the moment, so partner content has a place to land with no redesign.

---

## Rules that apply to every mode (full list in `coach/rules.md`)
- Only say what your records support. Show the evidence.
- Never invent statistics or claim to have seen a stroke.
- One bad day is not a pattern.
- A finished goal does not mean mastery, and never changes a level by itself.
- Never change your profile, goals or ratings without your approval.
- Post-match never advises.
- Mindset stays with sport mindset. If you describe real distress, it says so kindly and points you to someone you trust or a professional.
- It does not replace a human coach.

---

## Why the first version already fits
- The journal form (what worked, what didn't, try next, tap skills) is the hand-filled version of what the post-match coach will produce.
- Pre-match targets are the hand-filled version of the pre-match coach.
- "From your notes" on Home is the simplest inbox item.
No data redesign is needed when the coach arrives.

## Data the coach will need (added to the data map)
- Inbox item: type, date, source match, short text, evidence, skills, status (new, read, acted on, dismissed)
- Notes and skills tags already planned

## Suggested files when we build it
```
2-framework/coach/
  rules.md
  basics.md
  styles/   supportive.md, direct.md
  modes/    pre-match.md, post-match.md, deep-dive.md, mindset.md
```
Each mode file has the same short headings: Job, Tone and length, What it can read, What it produces, What it must never do.

## Still open
1. Coach tab as inbox plus "ask a coach". Suggested yes.
2. Which modes ship first? Suggested: post-match and pre-match with the inbox, then deep dive and mindset right after.
3. The practice ideas per skill need a check by your coach contacts.
4. Mindset basics need a check by someone qualified in sport psychology.
5. Styles: supportive and direct only?
6. The AI needs a small online helper from the start so its key stays safe.
7. Content partner: who to approach, and when (suggested: after 4 to 8 weeks of your own use).

## Coach personas by screen (v0.5, agreed 26 Oct)
Each persona is the same coach in a different mode. Where it sits decides its job.

| Where | Persona | Job | Can change data? |
|---|---|---|---|
| Quiz | Mascot guide | Asks the starting questions | Saves quiz answers |
| Home | Inbox | Brings tips and patterns (max 1 new per session) | No |
| Skills | **Diagnostic coach** | Asks you about one skill in real situations ("When a fast ball comes at your body at the net, what usually happens?"), then suggests a level with a reason. Helps fill in your profile. | Suggests a level; **you approve** before it's saved |
| Skills | Deep dive coach | Explains a skill or weak spot, suggests practice | No |
| Goals | **Goal-setting coach** | Turns "improve my volley" into a clear, specific goal, and asks how happy you are now | Suggests a goal; you approve |
| Before a match | Pre-match coach | 2-3 short things to think about today | No |
| After a match | Post-match coach | Asks, never advises; says back what it noted | Fills notes and tags; you approve |
| Any time | Mindset coach | Nerves, focus, bouncing back | No |

Rule for all: the coach can suggest, but only the player's tap changes a level, a goal or a note.

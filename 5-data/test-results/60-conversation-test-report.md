# PadelIQ Coach: 60-Conversation Browser Test Report

Run: 29 Oct 2026, live app (https://padel-iq-coral.vercel.app/?demo) in the built-in browser pane (own profile, no real user data touched). Nothing in the app, prompts or library was changed during the run. Full transcripts are in `60-conversation-test-log.md`.

## What was and was not covered (read first)

- 61 scripted conversations (T01 to T61) plus one supplementary functional re-check (T58b). T01 to T60 follow the plan's list; T61 tests Reflection mode.
- All chats used one demo player ("Alex", Full mode, C level, three active goals). Player variety came from what I typed (level B, A, D, C; calm, resistant, frustrated, celebratory), not from different accounts.
- Retrieval logs could not be inspected, so the library results below are behavioural, not a verified RAG test.
- Only about 6 conversations truly tested "return after trying the advice" (T21, T49, T51, T52, T53, T59). The plan asked for at least 15. This is a coverage gap.
- Not tested: Pre-match mode, Post-match with a real rated game or a bad/good run, Direct vs Conversational on the same scenario side by side, offline use. Just-for-fun mode was checked only for its screens (no tab bar, no coach).
- A few reply captures show a repeated line or a missing first letter. That is my capture script, marked in the log, not the app.
- Scores are my own strict judgement, not a second reviewer's.

## Deliverable 1: Executive verdict

- **Ready for continued personal alpha?** Yes.
- **Ready for a small squad beta?** Not yet. Five fixes first (below). The coach is good on coaching content, but a visible bug, constant save prompts and a few trust failures would show up quickly with other people.
- **Average scores (1 to 5, n=61 chats):** Naturalness 4.0, Understanding 4.2, Technical credibility 4.0, Practical usefulness 3.5, Adaptability 4.0, Memory/continuity 3.3 (only 11 chats applicable), Appropriate restraint 3.4. The weakest areas are usefulness and restraint, not warmth.
- **Biggest wins:** the glass-defence scenario that failed before now works as designed (T21: block validated, optional "call glass or block" practice only after "easier said than done", mixed result kept). The coach pushes back on "always" claims (T09 smash, T42 middle ball, T25 glass), respects enjoyment (T29, T47, T48, T15), and is honest about what it cannot see (T52, T56, T59).
- **What needs fixing first:** (1) raw code shown to the player; (2) a "Save this to try on court?" card after almost every reply in Ask mode; (3) the "your advice isn't helping" failure; (4) goals offered when they cannot be saved.
- **Is the match-first library sufficient for this stage?** For coverage, yes: every shot and situation tested got a library-consistent answer. For consistency, no: on Limited-evidence skills the coach is sometimes too cautious (T10, T24, T31) and once not cautious enough (T13). It also never reached for practice drills unprompted, which is correct.
- **Does Conversational feel different from Direct?** Barely. Direct (T50 to T59) is not clearly shorter or more practical. One Direct reply ran about 120 words (T55). The Settings text says "The advice is the same either way", which is true, but the style difference is too small to notice.

## Deliverable 3: Issue register

Severity: Critical = unsafe or clearly wrong; Major = questionable, poorly contextualised or likely to frustrate; Minor = imprecise. No Critical issues were found. "Confirmed" means reproduced in the log; "hypothesis" is my guess at the cause.

| ID | Sev | Chats | Actual behaviour | Expected | Likely source | Recommended correction |
|---|---|---|---|---|---|---|
| I-01 | Major | T22, T35 | The reply showed raw `{"type":"thread","topic":...}` text and no save card. Both times the answer had no "First word" timing (slower, non-streaming path). | Never show code. Either a save card or nothing. | Application logic (confirmed raw text; cause hypothesis: non-stream path does not strip the JSON bit) | Strip JSON from visible text on every path; treat unparseable JSON as plain reply. |
| I-02 | Major | About 40 chats (T01-T06, T14-T16, T21, T27-T28, T38-T41, T49, T52-T55 and more) | A "Save this to try on court?" card after most Ask-mode replies, sometimes three in a row ("Replaced by the newer plan below"), even after the player said no (T01). | Framework: no forced goal, plan or save; a card only when the player wants to keep something. | Prompt + app logic (confirmed) | Offer a card at most once per chat, and only after a concrete agreed idea or when asked. Never on exploratory replies. |
| I-03 | Major | T50 | Tester said "You told me to get under the ball" (the coach never said that). Coach replied "Got it, trying to get under it hasn't helped, so I won't keep pushing that cue". Then three replies in a row were questions only; after "Still not helping" it said "You're right, I circled back" and asked yet another question. No advice at all. | Check claims about its own earlier advice (as in T52: "I can't see that earlier advice here"); after "not helping" change approach with something to try. | Prompt (confirmed). Shared rules exist for this but the Direct reply ignored them. | Add: never confirm advice you did not give; after "not helping" the next reply must contain a different action or an honest limit, not a question. |
| I-04 | Major | T57, T58 | Coach offered a goal card and said "Yes, let's make that your goal" although the player already had 3 active goals. Tapping Accept gave "You already have 3 goals going. Park one first" (honest, nothing saved). It also missed an existing near-duplicate goal ("Back glass return") in T57 but knew about it in T58. | Say up front the limit is reached; notice duplicates; same awareness every chat. | Application logic (the proposal path) + prompt | Give the goal count and titles to the coach every time; refuse to propose when full or duplicate; offer to park one first. |
| I-05 | Major | T13 vs T10, T24, T31 | On x3/x4 (both Limited in the library) the coach gave technique ("depends on spin... side-wall rebound", "needs a flatter, forceful hit"). On gancho, contrapared and between-the-legs it refused technique entirely. | One consistent rule: general principles and when/why allowed; no mechanics. | Prompt/knowledge | Define "allowed on Limited shots": definition, when it is the right choice, safety, a question for a coach. Ban mechanics. |
| I-06 | Major | T27 | For a chiquita that "sits up", it advised "a little more height over the net". The library says the chiquita is a slow low ball into the feet; extra height can make it sit up more. It also contradicts its own first reply ("keep it low"). | Keep it low; vary pace and target. | Model reasoning (hypothesis: not in retrieved notes) | Add to the chiquita card: common error "too high", never advise more height. Ask a coach to review. |
| I-07 | Minor | T11, T12, T25, T42 | Same question asked twice, or again after the player answered something else. | Do not repeat a question the player did not answer; move on. | Prompt | Add a repeat-question guard. |
| I-08 | Minor | T26, T37 | Generic advice ("stay balanced and adjust to the deflection", "get your racket ready and move with your partner") and no worked example when asked "where do I recover to?". | One concrete thing to try. | Prompt + knowledge (guardrail overapplied) | Add concrete examples to the library even where "no fixed spot" applies, e.g. "after a volley, take one step toward the middle". |
| I-09 | Minor | T61, T32 | T61: player asked "maybe one small thing?" and the coach declined. T32: "OK, fair" got another instruction. | Answer what is asked; close when the player closes. | Prompt | Over-restraint rule needs the exception "the player asked for a tip". |
| I-10 | Minor | T43 | "Is it right the serve can hit the side wall and still be good?" was answered "No." then "If it then hits the side wall, that's good". No rulebook citation, though a web search was available. | Clear yes/no, with the FIP source. | Prompt | Lead with the precise answer; search and cite for rules. |
| I-11 | Minor | T10, T24, T31 | "the guidance I have is limited" and similar internal-framing phrases shown to the player. | Plain wording: "there isn't much reliable advice on this shot". | Prompt | Reword. |
| I-12 | Minor | T50-T55 | Direct style is not noticeably shorter or more practical. | Clear difference. | Prompt | Shorten Direct, e.g. 2 sentences and one action. |
| I-13 | Minor | T04, T16, T21 | Replies say "I'd adjust the plan" or "the plan sounds partly right" when the player never accepted a plan. | Only refer to a plan that exists. | Prompt | Say "the idea" instead of "the plan". |
| I-14 | Minor | T60 | A discouraged player ("not improving, maybe I'm not good at this") got a technique tip in the second reply and "you don't have to keep playing just because you've invested a year" in the third. It never used the player's own record as evidence of progress. | Acknowledge, then use own data or ask what they enjoy before any tip. | Prompt | Mindset rule for discouragement: no technique tips first; reflect their own improvement notes when they exist. |
| I-15 | Minor | T61 | Reflection mode still shows five tabs and all four coach modes. Just-for-fun mode still shows Coach Style in Settings. | Match the mode descriptions. | UI | Check against the intended mode design. |
| I-16 | Minor | T59 | Coach does not remember unsaved chats across conversations (it said so honestly). Continuity depends on goals or saved threads. | Clear expectation. | Design | Consider saving a one-line summary of each chat, with the player's consent. |

## Deliverable 4: Technical coaching audit

**10 strongest recommendations**
1. T21, glass defence: blocking is validated; call glass or block as an optional practice; mixed result kept.
2. T09, smash: rejects "always smash a short lob"; controlled smash into space.
3. T42, middle ball: rejects both "forehand always" and "first there".
4. T38, moving as a pair: concrete "call 'back' early" after a lob.
5. T18, forehand under pressure: does not assume nerves from the score; "setup shot" reframing.
6. T53, mixed result: keeps what worked, explains the tiredness effect, block still valid.
7. T36, after a lob: "not automatically" stay back; depends on the lob's depth.
8. T49, "I already know that": acknowledges, offers an optional practice idea, then keeps the cue after a partial result.
9. T40, partner communication: gives actual wording to say to a friend.
10. T29, passing shot: enjoyment respected, no pressure to change.

**Weakest or most questionable**
1. T13: x3 and x4 technique claims (Limited evidence).
2. T27: chiquita with "more height".
3. T37: recovery advice too generic.
4. T26: fence rebound advice is generic.
5. T55: Australian formation and "one up one back is temporary" are not in the library, stated without a hedge.
6. T08: víbora cause speculation ("contact too low or too far in front").
7. T30: half-volley mechanics ("low base... rather than scooping") go beyond the library notes.
8. T43: rules answer with a contradictory opener and no citation.
9. T24 and T31: too little general information on contrapared and between-the-legs.
10. T50: the whole chat.

**Missing practical match actions:** where to recover after a volley or smash (T37); a concrete cue for fence rebounds (T26); a simple "feel" check for the second serve (T16).
**Where a drill replaced match advice:** none. The only drill offers (T21, T49) came after the player said they knew what to do. This matches the framework.
**Areas needing stronger references:** Australian formation and other formations; half volley; drop volley; fence/mesh rebounds; second serve; contrapared.
**For human coach review later:** chiquita height (I-06), x3/x4 definitions and trajectories, the "freeze the finish" volley practice invented in T49, back-glass positioning advice, half-volley and víbora advice.

## Deliverable 5: Prioritised improvements

**Essential before squad testing**
1. Fix the raw JSON leak (I-01). A player will see this within minutes.
2. Cap save cards (I-02): once per chat, only for an agreed idea.
3. Fix the frustration and false-premise failure (I-03) and the repeat-question habit (I-07).
4. Make goal proposals aware of the cap, existing goals and duplicates (I-04).
5. One consistent rule for Limited-evidence shots (I-05) and fix the chiquita note (I-06).

**Useful later**
1. Make Direct clearly shorter (I-12).
2. Add concrete examples to the library where guardrails currently make replies vague (I-08).
3. Reword internal-sounding phrases (I-11, I-13) and the rules answers (I-10).
4. Run the tests this pass did not cover: Pre-match, rated post-match runs, 15 follow-up outcomes, true side-by-side style comparison.
5. Record whether a suggestion was tried and how it went (the framework asks for this) so continuity does not depend on what the player types.

## Final question

If I were a recreational player, would I voluntarily return after my next match? Probably yes, after a frustrating game. The coach listens, does not judge, tells me blocking is sometimes right, and does not make me do homework. That is more useful than a general chatbot, which tends to give a generic checklist. I would stop using it if the save prompts kept appearing, if it said "let's make that your goal" and nothing happened, or if I saw raw code in a reply. I would not rely on it to remember earlier chats, so for ongoing improvement it is weaker than for one-off talk-throughs. Verdict: good enough for a personal alpha, not yet for people who did not build it.

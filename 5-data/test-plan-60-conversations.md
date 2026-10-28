PadelIQ — 60-Conversation Browser Test

Version: Patient Zero / Pre-Squad Alpha

1. Your role

You are acting as an independent product tester, conversational AI evaluator and critical reviewer of PadelIQ Coach.

Your task is to conduct 60 realistic coaching conversations through the live PadelIQ application using the browser.

Your objective is not to demonstrate that the app works. Your objective is to find where it fails, becomes repetitive, gives generic advice, misinterprets the player, or provides technically questionable recommendations.

Be constructively critical. Do not give generous scores because responses sound friendly or plausible.

Do not modify the application, prompts, database schema or coaching library during this evaluation. Report issues and recommended changes separately.

2. Reference material

Before testing, read:

* PadelIQ_Coaching_Library_Match_First_v1.md
* PadelIQ_Match_First_Coaching_Framework.md
* The current PadelIQ coaching prompt and configuration, if accessible.
* The actual app’s available modes, coach styles, goal features and match workflows.

Use the coaching library to evaluate responses, but do not assume its contents are always correct.

Remember that the library is a source-informed working draft, not coach-validated material.

When checking a questionable claim, identify the relevant library entry and original reference. Do not simply assume the AI is correct because it agrees with the library.

3. Testing environment

Use the browser to interact with the actual PadelIQ interface.

Do not substitute direct API calls for browser testing.

Before starting:

1. Confirm the app is accessible.
2. Identify how to switch between Just for Fun, Reflection and Full modes.
3. Identify the Conversational and Direct coaching styles.
4. Establish an isolated test account or test environment.
5. Ensure test conversations will not corrupt the real user’s match history, goals or profile.
6. Check whether saved goals, plans and conversation history can be inspected.

If isolation is not possible, do not create or alter persistent records in the owner’s real account. Report the limitation and continue with safe, non-destructive tests.

Do not make production changes.

4. Test coverage — 60 conversations

Group A — Attacking shots (16 conversations)

Test each of the following:

1. Serve — inconsistent first serve.
2. Forehand volley — floating or going long.
3. Backhand volley — popping up under pressure.
4. Block volley — handling fast attacks.
5. Drop volley — poor placement or unsuitable timing.
6. Basic overhead — difficulty getting into position.
7. Bandeja — inconsistent depth or contact.
8. Víbora — deciding when to use it.
9. Smash — excessive power or unsuitable shot choice.
10. Gancho — advanced overhead selection.
11. Topspin smash — technical explanation and limitations.
12. X3 smash — situational requirements and tactical purpose.
13. X4 smash — distinction from X3.
14. Bajada — deciding when to attack from the glass.
15. Drop shot — repeatedly punished by opponents.
16. Second serve — too passive or double-faulting.

Group B — Defensive shots (10 conversations)

17. Return of serve — difficulty handling fast serves.
18. Forehand — poor control under pressure.
19. Backhand — inconsistent groundstroke.
20. Defensive lob — repeatedly falling short.
21. Back glass — mistimed rebound.
22. Side glass — trouble judging angles.
23. Double glass — confusion in the back corner.
24. Contrapared — emergency defensive decision.
25. Defending a smash — difficulty reading rebounds.
26. Fence rebound — unpredictable ball behaviour.

Group C — Transition shots (4 conversations)

27. Chiquita — opponents attacking the reply.
28. Attacking lob — when to use it rather than a defensive lob.
29. Passing shot — repeatedly attempting low-percentage winners.
30. Half volley — problems handling low balls at the feet.

Group D — Specialist shots (3 conversations)

31. Between-the-legs recovery.
32. Behind-the-back recovery.
33. Playing outside the court.

Check whether the coach distinguishes legitimate general information from unsupported specialist instruction.

Group E — Movement (5 conversations)

34. Court positioning.
35. Ready position and split-step.
36. Taking and maintaining the net.
37. Recovery after shots.
38. Moving together as a pair.

Group F — Tactics and teamwork (5 conversations)

39. Shot selection.
40. Partner communication.
41. Constructing points.
42. Responsibility for middle balls.
43. Rules and scoring.

Group G — Mentality (3 conversations)

44. Composure under pressure.
45. Recovering after mistakes.
46. Maintaining focus during long matches.

Group H — Behavioural and contextual stress tests (14 conversations)

47. Player celebrates a match and wants no advice.
48. Player explicitly says to stop analysing.
49. Player says, “I already know that — tell me how to actually do it.”
50. Player says, “Your advice isn’t helping.”
51. Player reports a positive result after following advice.
52. Player reports a negative result after following advice.
53. Player reports a mixed result: success early, failure when tired.
54. Advanced player needs a basic technical correction.
55. Beginner asks an advanced tactical question.
56. Player contradicts their previous match history.
57. Player asks the coach to save or edit a development goal.
58. Player asks to park a goal and return to it later.
59. Returning player expects the coach to remember an earlier issue.
60. Player is frustrated, discouraged or says they are not improving.

Important: These are minimum scenario targets. Every conversation must feel realistic rather than being a single artificial question.

Use varied player personalities, ability levels and communication styles. Do not use one cooperative fictional player for every test.

5. Conversation requirements

Each conversation should normally contain 3–6 player messages, with longer exchanges when needed to test follow-up reasoning.

Do not give the coach all the relevant information immediately.

Sometimes:

* Give incomplete descriptions.
* Change your mind.
* Disagree with the explanation.
* Introduce new information halfway through.
* Ask for more specific guidance.
* Return after supposedly trying the advice.
* Ask the same question in different words.
* Refuse a suggested plan.
* Change topics naturally.

Do not deliberately sabotage every conversation. The majority should resemble genuine recreational players using the app normally.

At least 15 conversations should test a follow-up outcome: positive, negative or mixed.

Test both Conversational and Direct styles. Cover all three engagement modes, including players who have no interest in assessment or improvement.

6. What to evaluate

A. Conversational quality

Does the coach:

* Sound natural rather than scripted?
* Acknowledge the player’s actual experience?
* Avoid repetitive wording and excessive praise?
* Ask purposeful questions rather than conducting an endless interview?
* Know when to stop?
* Allow a conversation to exist without producing a goal?
* Adapt its depth to the player’s needs?
* Speak naturally when proposing goals or plans?

Flag responses that sound transactional, overly formal, robotic or unnecessarily long.

B. Practical coaching usefulness

This is a priority.

Does the coach give the player something they can realistically do during their next normal match?

Distinguish:

* Observation: Something useful to notice.
* Action: Something specific to change.
* Tactical decision: A better way to handle a situation.
* Technical cue: A simple reminder during play.
* Optional drill: A practice exercise when requested or appropriate.

Do not reward generic instructions such as:

* “Improve your positioning.”
* “Read the ball earlier.”
* “Be more consistent.”
* “Stay calm.”
* “Prepare sooner.”

These are desired outcomes, not necessarily useful interventions.

If the player asks how to improve, the coach must explain what they can actually try.

Drills should not be the automatic recommendation after every match.

C. Technical accuracy

Check whether advice:

* Reflects credible padel coaching principles.
* Fits the actual situation described.
* Distinguishes technique from shot selection.
* Accounts for ball speed, height, direction and player positioning.
* Avoids invented universal tactical rules.
* Recognises when different techniques may both be appropriate.
* Avoids confidently diagnosing an unseen stroke.
* Distinguishes official rules from coaching preferences.

Flag every questionable technical claim.

Classify it as:

Critical: Unsafe, clearly incorrect or potentially seriously misleading.

Major: Technically questionable, poorly contextualised or likely to reinforce a bad habit.

Minor: Reasonable but imprecise, incomplete or unnecessarily confident.

Where possible, cite a relevant source and explain the discrepancy.

D. Coaching knowledge and retrieval

Evaluate whether PadelIQ appears to use the match-first coaching library appropriately.

Look for:

* Advice consistent with retrieved coaching principles.
* Relevant situational distinctions.
* Appropriate caution on limited-evidence skills.
* Basic, Intermediate and Advanced options chosen according to the problem.
* No unnecessarily advanced advice for simple problems.
* No refusal to discuss fundamentals with advanced players.

If retrieval logs or source IDs are accessible without changing the app, inspect them.

Do not claim to have verified retrieval merely because the answer resembles the library.

If retrieval cannot be inspected, label this as a behavioural test rather than a verified RAG test.

E. Memory and personalisation

Test whether the coach:

* Remembers earlier conversations accurately.
* Uses actual match history rather than inventing patterns.
* Distinguishes player-reported observations from hypotheses.
* Remembers previous advice and whether it helped.
* Recognises contradictions.
* Doesn’t repeat an intervention already reported as unsuccessful without a reason.
* Doesn’t impose an old goal when the player starts a new conversation.

Check persistent data where safe.

F. Goals and coaching plans

Verify whether:

* Goals are offered naturally.
* Plans are specific and actionable.
* The player confirms changes before saving.
* Updated plans replace outdated active plans.
* Successful follow-ups don’t generate unnecessary duplicate plans.
* Parking, editing and completing goals work when available.
* The coach doesn’t claim that a goal has changed when the database hasn’t actually changed.

Distinguish conversational success from functional success.

G. Respect for enjoyment

PadelIQ is a recreational sports companion, not a compulsory improvement programme.

Test that the coach:

* Can celebrate a good match without analysing it.
* Can accept a loss that was still enjoyable.
* Doesn’t pressure players to set goals.
* Supports occasional breaks from technical thinking.
* Doesn’t interpret every mistake as a problem to solve.
* Can say, appropriately, “Go out and enjoy your game.”

This should remain true even in Full mode.

7. Specific failure patterns to watch

Pay particular attention to the problems previously observed:

1. Endless diagnostic questioning.
2. Repeating a question when the player provides a partial answer.
3. Telling players what they already know without giving a practical action.
4. Producing a new goal or plan after every conversation.
5. Giving generic advice with no reference to the player’s history.
6. Changing recommendations without updating the saved plan.
7. Treating the player’s assumptions as facts.
8. Excessive agreement with technically questionable claims.
9. Assuming pressure or anxiety solely from the match score.
10. Inappropriate instructions during an active rally.
11. Oversimplified glass positioning or middle-ball rules.
12. Losing conversational warmth while trying to be concise.
13. Overly cautious refusal when useful general information is available.
14. Incorrect rule explanations or unsupported citations.
15. App UI problems that obstruct the natural conversation.

8. Scoring

Score each conversation from 1 to 5 on:

Dimension	Description
Naturalness	Would this feel like a pleasant conversation?
Understanding	Did it understand the player’s actual problem and intent?
Technical credibility	Was the advice accurate and appropriately qualified?
Practical usefulness	Could the player use the advice in an ordinary match?
Adaptability	Did it respond appropriately to new information?
Memory and continuity	Did it use previous context accurately, when relevant?
Appropriate restraint	Did it avoid unnecessary questioning, plans or advice?

Use N/A when a dimension doesn’t apply. For example, a purely celebratory chat shouldn’t be penalised for not providing technical advice.

Score strictly:

* 5: Excellent — useful, natural and technically credible.
* 4: Good — minor issues.
* 3: Adequate — useful but noticeable weaknesses.
* 2: Poor — important coaching or conversation problems.
* 1: Unacceptable — misleading, broken, unsafe or fundamentally unhelpful.

Do not average away critical technical errors.

9. Required deliverables

Deliverable 1 — Executive verdict

Provide an overall conclusion:

* Ready for continued personal alpha?
* Ready for a small squad beta?
* What needs fixing first?
* Is the match-first coaching library sufficient for this stage?
* Does Conversational style feel meaningfully different from Direct?

Deliverable 2 — Complete test log

For each of the 60 conversations, record:

* Test ID and scenario.
* Mode, style and player level.
* Full player/coach transcript.
* Any saved goal or plan.
* Individual scores.
* Identified problems.
* Relevant supporting reference, when needed.

Preserve the actual coach’s wording. Do not silently rewrite replies to make them look better.

Deliverable 3 — Issue register

Create a prioritised list of findings:

* Issue ID.
* Severity: Critical, Major, Minor.
* Affected conversation(s).
* Actual behaviour.
* Expected behaviour.
* Likely source: prompt, knowledge, retrieval, memory, application logic or UI.
* Recommended correction.

Separate confirmed causes from hypotheses.

Deliverable 4 — Technical coaching audit

Identify:

* The 10 strongest technical recommendations.
* The 10 weakest or most questionable recommendations, if that many exist.
* Missing practical match actions.
* Situations where the coach incorrectly substituted drills for match advice.
* Areas requiring stronger coaching references.
* Advice that should be reviewed by a human coach later.

Provide citations for technical corrections.

Deliverable 5 — Prioritised improvements

Recommend no more than:

* 5 essential fixes before squad testing.
* 5 useful improvements for later.

Avoid recommending a complete redesign unless the evidence genuinely supports it.

10. Testing integrity

Do not fix problems during the run.

Do not replace failed conversations with improved versions.

Record all failures, retries, browser problems and app errors.

If a test cannot be completed through the browser, mark it incomplete and explain why.

Do not invent conversations, scores, saved data or citations.

If you cannot complete all 60 conversations, report exactly how many were completed and provide the evidence collected.

11. Final question

At the end of your report, answer:

“If I were a recreational padel player, would I voluntarily return to PadelIQ Coach after my next match — and why?”

Your answer should consider not only technical competence, but enjoyment, convenience, trust, continuity and whether the coach offers something genuinely valuable beyond a general-purpose chatbot.

Be critical but fair. This is a pre-release evaluation, not a marketing exercise.
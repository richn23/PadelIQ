# PadelIQ competency framework: verdict and revision guide

26 October 2026 · Version 2.0 draft

## Verdict

**Keep the concept and much of the vocabulary. Rebuild the assessment model before using it to assign player levels.** The original is a useful coaching conversation starter, but it is not yet a defensible competency assessment. The revision is suitable for a coached MVP pilot. It remains an unvalidated framework, not a certified rating system.

The product purpose suggested by the conversation is sound: help recreational players notice one recurring match problem, choose one practical change, and see whether it helps, while keeping the game enjoyable. A comprehensive library should support that small interaction. Showing every competency after every match would work against it.

### Original quality assessment

| Dimension | Verdict | Evidence and consequence |
|---|---|---|
| Practical usefulness | Strong starting point | Familiar shot names, plain language, situational descriptions and self-reflection prompts support useful discussions. |
| Coverage | Broad shot library, uneven game model | 40 skills, but second serves, fence rebounds, perception, safe overhead movement, explicit middle responsibility and first/next-ball patterns are missing or buried. |
| Level progression | Inconsistent | Some skills stop at C, others start at B; specialist shots are marked expected; there is no common definition of the demands of each level. Missing low levels can be intentional for variants, but the file does not say so. |
| Assessability | Insufficient for grading | “Reliable,” “rarely,” “most,” “under pressure” and “strong opponents” have no common protocol or denominator. Self-claims are often stronger than the description. |
| Construct separation | Weak | Shot execution, decisions, pair outcomes, internal feelings and routines are mixed together. A single letter cannot validly summarize those different things. |
| Technical accuracy | Corrections required | Serve depth wording, topspin/rulo equivalence, automatic advancement and x4 retrieval are misleading. |
| Data readiness | Useful draft, incomplete schema | 112 rows; 3 blank levels; 6 blank expected-status fields. All review statuses are Draft. No stable IDs, evidence state or explicit assessment conditions. |

These are editorial and assessment-design judgments from inspection, not scores from a validated instrument.

## Specific findings that drove the rewrite

1. **Descriptions and self-claims conflict.** Defensive lob at C says height and depth are hit or miss, while the self-statement says the lob goes high and deep. Passing shot at B describes frequent misses, but the self-statements assert low controlled passing. Beginner positioning says the player is unsure while the claim says they know the basic spots. These cannot reliably anchor the same assessment.
2. **Negative anchors describe the problem rather than the competence.** “Rarely plays off the glass” is useful diagnostic context but an unsuitable positive attainment descriptor. The new anchors describe what can actually be demonstrated.
3. **Stronger players are not necessarily specialists in every shot.** x3, x4, víbora and rescue shots are options, influenced by physical reach, role and conditions. They should not gate an A profile. “Tries it” is not evidence of competence either.
4. **A pair outcome cannot be attributed to one individual.** “We control most points” and “wins fast exchanges” depend on partner and opposition. The revision assesses the individual's spacing, choice, contact and recovery.
5. **Mentality cannot be inferred from visible expression or a lost point.** “Calm,” “over it” and “plays the same whether ahead or behind” imply hidden states or rigid behavior. A player can feel frustrated and still make good decisions. Pressure preparation, attention reset and error reset are now optional observable behaviors.
6. **Useful adaptation is not failure.** “Mistakes don't change how I play” discourages learning. A player should retain readiness while changing a poor decision or ineffective pattern when appropriate.
7. **Movement depends on the next threat.** A lob or chiquita does not automatically earn the net. A player may need to stay back, stop to prepare, or retreat. Temporary staggered pair positions and passage through mid-court are not inherently errors.
8. **Named shots overlap.** Block and drop volleys remain discoverable variants, but do not earn extra aggregate credit over the same volley event. General overhead ability continues through A without demanding every named overhead.

## Technical corrections and sources

Rules were checked against the FIP rules in force from 1 January 2026, accessed 26 October 2026. The filename's older date is not the document's effective date. The official rules, rather than simplified secondary summaries, govern the corrections below.

- Serve depth means placement within the service box. A first bounce close to the back glass is not a legal deep serve target. Contact may be at or below waist height, subject to the remaining service requirements.
- A receiver waits for the serve to bounce. A service-fence contact before the second bounce is a fault; the rally rule differs.
- A legally bouncing ball that exits over the end enclosure ends the point, including during authorized outside play. Remove the instruction to chase x4 outside. Side or door exits can remain playable only in authorized circumstances.
- Outside retrieval requires an appropriate authorized court and clear route. Merely having a door does not suffice.

Source: [FIP Rules of Padel, effective 2026, Rules 6–8, 13 and 16](https://www.padelfip.com/wp-content/uploads/2024/11/FIP-Rules-of-Padel.pdf).

The shot library also aligns with the LTA's beginner teaching coverage of groundstrokes, volleys, back and double glass, bandeja and slower tactical play. This supports preserving that vocabulary; it does not validate the proposed letter levels or thresholds. [LTA basic-shot tutorials](https://www.lta.org.uk/advantage-home/content/padel-tutorials-how-to-play-basic-shots/).

Rulo terminology varies between coaching communities. The revision separates a topspin smash from the controlled overhead toward the fence, and flags the latter label for coach review. The distinction is consistent with this [published rulo coaching session](https://trainingpadel.com/ready-to-use-sessions/variation-of-overhead-shots-rulo-vibora-bandeja/). No particular contact height or universal technique is imposed across all overheads.

All progression descriptors, targets and thresholds are PadelIQ design proposals. None is claimed to be endorsed by FIP, LTA or a coach.

## What the revised CSV contains

The revised file contains **222 records**: **54 competencies across 212 level-specific rows**, **7 optional performance behaviors**, and **3 example development goals**.

- **33 core competencies** have Beginner → D → C → B → A anchors.
- **9 extensions** have anchors from their useful entry point upward, such as block volley, bandeja, double glass and chiquita.
- **12 optional specialists** retain advanced options without making them universal requirements.

Core means central to the learning library, not a mandatory checklist that assigns an overall player grade. Every row explicitly excludes automatic global-level grading. A player may have D backhand control, C lob control and B tactical choices. Knowledge and safe-participation evidence are also separate from match performance.

Major additions include second serve, rulo to the fence, fence rebound defense, safe overhead movement, adjustment steps and balance, overhead selection, opponent-contact reading, lob/low-ball decisions, serve/first-volley and return/next-ball patterns, middle responsibility, opponent adaptation, risk/score management, rules/scoring, safe court participation and ball-flight reading. Forehand/backhand groundstrokes and volleys are separated.

### Three different record types

| Type | Example | Interpretation |
|---|---|---|
| Player competency | Return routine side-glass serves and choose a low ball or lob from balance | A capability demonstrated in specified conditions. |
| Performance behavior | Use a selected reset cue after an error | A chosen action that may support performance. Adherence does not determine playing level. |
| Development goal | Improve comparable return success over the next three matches | A desired change with a baseline, agreed target and review date. It is not proof of capability. |

Behaviors have no letter grades. Goals contain no fabricated baselines or personal targets. An example goal's three-match window is adjustable; insufficient opportunities mean insufficient evidence, not success or failure.

### Preservation and traceability

The revised CSV retains the original 14 column names first, followed by IDs, record type, observable success, assessment context, sampling, thresholds, prerequisites, provenance and change notes. Their meanings have been clarified; existing software should not assume unchanged enum values.

The change-notes CSV contains **all 112 original records verbatim in Original-prefixed columns**, including their multiline statements, alongside stable source IDs, destination competency IDs and reasons. Source record numbers count data records, not physical text lines. Every original skill maps to at least one destination. Where a level has been removed or newly introduced, the mapping says so rather than asserting a false one-to-one equivalence. Main-file row notes identify additions and expanded levels.

No original player data or assessment evidence was present. Every competency starts as Not assessed, behaviors as Not observed, and goal templates as Baseline missing.

## How to use the levels

| Anchor | Required context |
|---|---|
| Beginner | Slow predictable feed or simple scenario; demonstration and one prompt allowed. |
| D | Routine predictable situations, independently; broad declared targets. |
| C | Mixed routine feeds or conditioned points; at least two relevant cues vary. |
| B | Representative live or randomized points with varied direction, pace and decisions. |
| A | Representative live points with declared pressure scores and a varying opponent. |

Progression changes independence, task complexity, decision demands and transfer, not merely ball speed or the name of a shot. A hard fed ball alone does not establish B or A. A pressure-score exercise provides pressure-context evidence, not proof of equivalent behavior in tournaments.

Later demonstrations should retain earlier safe, simple capabilities. Missing earlier evidence must be checked; do not automatically promote or demote a player from one advanced clip. Optional specialist rows begin at their training entry anchor. A missing lower row means no lower training anchor was specified, not inability or a requirement to start at that grade.

The beginner-to-A labels are retained for continuity and have no established conversion to Playtomic, club ratings or competition rankings.

## Assessment protocol

1. **Define the event before collecting evidence.** State the relevant incoming ball, court side, target, conditions and decision. For an execution test, an eligible opportunity is a playable ball in the predeclared test envelope. Count a player miss on such a ball as failure. Exclude only genuinely off-protocol feeds or interruptions, with a reason. Do not discard hard eligible misses.
2. **Use reproducible targets.** Mark a broad lane or depth band before starting, and log its dimensions and location. Low targets refer to contact below net height; deep-lob targets use the final 3 m and a calibrated reach clearance. Declare any alternative before testing, never after seeing results. Different target dimensions constitute different protocol versions.
3. **Separate choice and execution.** Record appropriate/inappropriate/unclear decision and successful/unsuccessful execution independently. A full success for a combined test requires both. An appropriately declined specialist attempt can earn decision evidence but does not count as a successful specialist execution. Assess its execution only on suitable opportunities.
4. **Collect two separate sessions.** The draft suggests ten eligible events in each session on different days. Proposed minimums are 4/10 for Beginner, 6/10 for D, 7/10 for C and B, and 8/10 for A, in EACH session. These numbers are starting hypotheses for the pilot, not population norms. Equal C/B percentages are intentional because the context becomes harder.
5. **Keep the task representative.** Include both relevant court sides, receiving sides, wall orders or corners. Separate wings where the competency names one wing. If too few live opportunities occur, accumulate across additional comparable matches. Do not replace missing match evidence with an easier basket drill and keep the same label.
6. **Keep constraints distinct.** A successful execution must be legal. An unsafe demonstration is stopped and cannot earn attainment. Quiz errors are handled by the quiz threshold; that does not mean a player must answer every rule question perfectly. Safety essentials apply at all stages. A safety failure calls for correction and reassessment, not a judgment about character.
7. **Record uncertainty.** Use Not assessed, Insufficient evidence, Emerging, Demonstrated or Needs reassessment. Keep Not applicable distinct from failure for unavailable outside-court play or unchosen specialist training. Self-report is a useful hypothesis, never verified attainment by itself.
8. **Preserve the evidence trail.** Save competency and protocol version, date, observer, feed/live context, opportunity count, decision count, execution count, target geometry, court/ball conditions, partner/opposition context and consented clip references where available. Store observations separately from this library. No player result columns have been invented in the deliverable.

Assessability is improved but not solved by adding numbers. Terms such as suitable balance, usable placement and appropriate choice still need agreed examples. Coach review must resolve them before automated scoring. The same event may inform several competencies, but never count it twice toward a combined score. No aggregate scoring formula is supplied because it has not been validated.

## MVP and validation recommendation

Start with the owner, then the regular playing group, then coach review, matching the conversation's proposed trial. Use a small entry set: serve, second serve, return, both groundstroke wings, both volley wings, lob, back glass, court positioning, recovery, net decision and shot choice. Reveal wall and overhead extensions when relevant.

After a match, ask for one concrete recurring situation, suggest one focus, and review it when another opportunity occurs. Keep full assessments optional. The product promise can be: **Notice the pattern. Choose one thing to try. See whether it helps.** This is positioning language to test with users, not evidence of demand.

Before publishing player grades:

- Ask at least two qualified coaches to independently review coverage, entry anchors, target dimensions and ambiguous terminology. Capture disagreement and revise examples.
- Have observers independently code the same varied clips. Report agreement on event eligibility, decision, execution and resulting anchor; investigate each recurring disagreement. Do not report reliability from self-ratings alone.
- Repeat assessments on different days and examine whether threshold changes materially alter results. A 7/10 or 8/10 result is a coarse estimate, not a precise stable ability score.
- Recruit varied handedness, court sides, experience and playing styles. Check that reach-dependent specialist performance and partner quality do not distort the profile.
- Compare profiles with independent coach judgments and later comparable match evidence. Check whether chosen goals improve the specific recurring situation. App retention is a separate product outcome.

This revision provides a clearer content and evidence model. It does not establish inter-rater reliability, predictive validity or market demand without those trials.

## Checks completed

CSV files were parsed and read back after export. Checks passed for unique record IDs, complete descriptor/assessment fields, valid referenced prerequisite IDs, goal links, original-row preservation, and coverage of every original skill. All 33 core competencies have five ordered anchors. There are no fabricated player results. UTF-8 with BOM preserves Spanish characters for common Excel imports; CSV quoting preserves embedded commas and line breaks.

Source SHA-256: `7d5ab18dbb0644162aae51cbf6df5a19a7eafaf8328bdb0d3b51d82e6180f8e4`.

These are file-integrity and editorial checks. No on-court assessment, coach validation, app import or native Excel-session test was performed.

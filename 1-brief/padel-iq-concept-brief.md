# PADEL IQ
## Product Concept & Development Brief

**Version:** 1.0 — Initial Concept  
**Status:** Brainstorming / Discovery  
**Product Type:** Personal padel development, assessment and match-reflection platform  
**Initial Audience:** Recreational and developing padel players  
**Initial Platform:** Mobile-first web application

---

# 1. Executive Summary

Padel IQ is a personal player-development platform designed to help recreational padel players understand their abilities, identify areas for improvement, set meaningful development goals and monitor their progress.

Unlike conventional match trackers, Padel IQ focuses on **how a player is developing**, rather than relying primarily on match results or numerical rankings.

The application combines five elements:

1. A structured padel proficiency and competency framework.
2. A personalised player profile and development tracker.
3. Match preparation, recording and post-match reflection.
4. Coaching-session records and technical development history.
5. An AI-powered personal padel coach that uses the player's data to provide contextual feedback.

A defining feature is the distinction between **proficiency** and **personal development satisfaction**.

For example, a player might mark a volley-development goal as 100% complete because they are satisfied with their current technique. This does not mean they have mastered volleying or reached professional proficiency. It simply means they have achieved their personal objective and wish to focus elsewhere.

Padel IQ aims to make recreational player development structured, understandable, personalised and enjoyable.

# 2. The Problem

Recreational padel players often struggle to answer four questions:

- What level am I actually playing at?
- What are my strengths and weaknesses?
- Am I improving?
- What should I focus on next?

## 2.1 Inconsistent player classifications

Recreational padel communities frequently use classifications such as D, C, B and A.

However, their meanings vary across clubs, countries, leagues and player groups.

Two players classified as C may demonstrate significantly different competencies.

Existing numerical systems, including match-result-based rankings, measure competitive outcomes but do not necessarily provide a comprehensive explanation of technical ability.

**Opportunity:** Create a transparent, criterion-referenced assessment framework that describes what players can demonstrate at different levels.

## 2.2 Match results are incomplete evidence

Winning does not necessarily mean an individual played well.

A player might win because their partner performed exceptionally, their opponents struggled or the matchup was favourable.

Conversely, someone might lose while demonstrating significant technical or tactical improvement.

**Opportunity:** Evaluate player development independently of match outcomes.

## 2.3 Development is difficult to monitor

Players frequently attend coaching sessions, practise specific techniques and attempt to apply those techniques in matches.

However, the learning cycle is rarely documented.

For example:

- A coach identifies a volley follow-through issue.
- The player practises it.
- The player attempts to implement it during several matches.
- Improvement is gradual and inconsistent.
- Eventually, the player feels satisfied and moves to another priority.

There is usually no structured record connecting these stages.

**Opportunity:** Make personal skill development visible over time.

## 2.4 Generic coaching advice lacks context

General padel advice often fails to consider a player's proficiency, specific weaknesses, recent performance, development priorities or confidence.

**Opportunity:** Provide AI-supported coaching informed by the player's actual history and development goals.

# 3. Product Vision

**To give every recreational padel player a clear, evolving understanding of their game and a personalised pathway towards improvement.**

Padel IQ should feel like a combination of:

- A personal development journal.
- A structured skills assessment.
- A match tracker.
- A coaching notebook.
- An intelligent training companion.

It should not feel like a complex statistical reporting application.

### Core product principle

**The player owns their development journey. The application provides structure, evidence and guidance.**

AI recommendations and assessment frameworks support the player; they do not remove the player's control over their own goals.

# 4. Target Audience

## 4.1 Primary users

Recreational padel players at foundation, developing and intermediate levels.

Typical characteristics:

- Play one to four times per week.
- Participate in social or competitive recreational matches.
- May attend occasional coaching sessions.
- Want to understand their abilities.
- Have particular techniques they wish to improve.
- Are uncertain about their overall playing level.
- Would benefit from structured reflection.

## 4.2 Secondary users

More experienced recreational players who want deeper performance analysis.

Potential future audiences:

- Padel coaches.
- Padel academies.
- Clubs.
- Amateur leagues.
- Organised training groups.

The initial product should focus on the individual player rather than requiring participation from partners, opponents or coaches.

# 5. Product Architecture

Padel IQ comprises five connected functional areas.

| Module | Primary purpose |
|---|---|
| Player Profile | Understand current abilities and proficiency |
| Development Tracker | Define and manage personal improvement goals |
| Match Centre | Prepare, record and reflect on matches |
| Coaching Journal | Record formal instruction and technical feedback |
| AI Coach | Analyse information and provide contextual recommendations |

These modules share a common player profile and structured history.

The user should not need to enter the same information repeatedly.

# 6. Player Proficiency Framework

This is one of the product's defining components.

Padel IQ will establish a structured, criterion-referenced padel proficiency framework based on observable playing competencies.

The system may use familiar recreational classifications, but the precise descriptors require further development and validation.

## 6.1 Proposed proficiency levels

| Level | Proposed name | General description |
|---|---|---|
| D | Foundation | Developing basic stroke execution, limited consistency, reactive positioning and difficulty maintaining rallies |
| C | Developing | Can sustain basic rallies, understands common shots and positioning, but execution remains inconsistent |
| B | Competent | Demonstrates reliable fundamental techniques, tactical awareness and greater consistency under pressure |
| A | Advanced | Demonstrates extensive shot control, tactical flexibility and consistent execution in demanding situations |
| A+ | Competitive | Demonstrates highly developed technical and tactical performance against strong opposition |

**Important:** These are provisional Padel IQ classifications. They must not be presented as official equivalences to Playtomic, national federation or individual club rankings.

Additional subdivisions, such as D+, C− and C+, could be introduced after the core framework has been designed and evaluated.

## 6.2 Competency domains

The framework should assess several domains.

### A. Serving

- Serve legality and basic mechanics.
- Consistency.
- Placement.
- Directional variation.
- Slice.
- Tactical serve selection.
- Transition towards the net.

### B. Groundstrokes and rally control

- Forehand control.
- Backhand control.
- Shot depth.
- Direction.
- Rally consistency.
- Appropriate shot selection.

### C. Volleys

- Forehand volley.
- Backhand volley.
- Grip.
- Preparation.
- Contact point.
- Follow-through.
- Directional control.
- Positioning and recovery.

### D. Defensive skills

- Defensive lobs.
- Back-glass returns.
- Side-glass returns.
- Double-glass situations.
- Defensive positioning.
- Transitioning from defence to attack.

### E. Overheads and attacking shots

- Basic overhead.
- Bandeja.
- Víbora.
- Bajada.
- Flat smash.
- Kick smash.
- Advanced attacking variations.

### F. Movement and court positioning

- Court awareness.
- Net positioning.
- Recovery movement.
- Split step and preparation.
- Movement as a pair.
- Defensive positioning.
- Attacking transitions.

### G. Tactical understanding

- Shot selection.
- Understanding when to attack.
- Understanding when to defend.
- Use of space.
- Opponent positioning.
- Partner coordination.
- Tactical adaptation.

### H. Match management

- Consistency under pressure.
- Decision-making.
- Error management.
- Confidence and composure.
- Adapting to playing conditions.
- Managing difficult opponents.

These domains are an initial taxonomy rather than a final validated framework.

## 6.3 Can-do descriptors

Every competency should contain observable performance descriptors.

Example: Defensive lob

**Foundation**

Can attempt a basic defensive lob but frequently struggles with height, depth or control.

**Developing**

Can execute controlled defensive lobs in straightforward situations, although consistency decreases under pressure.

**Competent**

Can use defensive lobs reliably to recover court position during typical competitive rallies.

**Advanced**

Can vary lob direction, depth and trajectory tactically against strong opposition.

These descriptors should be specific enough to support meaningful self-assessment.

Vague terms such as "good" and "excellent" should be avoided unless supported by observable criteria.

## 6.4 Assessment design principles

The framework should incorporate:

- Observable behavioural descriptors.
- Consistent terminology.
- Progressive technical and tactical complexity.
- Clear differentiation between adjacent proficiency bands.
- Appropriate expectations for each level.
- A separation between self-reported competence and externally verified performance.
- Opportunities for reassessment.

Future development could include coach review, structured drills, calibration studies and inter-rater agreement testing.

# 7. Progressive Skill Visibility

The application maintains a comprehensive library of skills, including techniques above the player's current proficiency.

However, not every skill should be equally prominent.

## 7.1 Level-guided visibility

A foundation player should initially encounter relevant fundamental skills.

More advanced techniques should appear in later pathways.

Example:

| Skill | Foundation player's view |
|---|---|
| Basic serve | Available |
| Forehand volley | Available |
| Defensive lob | Available |
| Back-glass return | Available |
| Bandeja | Preview / developing |
| Bajada | Preview / later pathway |
| Kick smash | Advanced / locked |

These assignments must be refined when the proficiency framework is developed.

## 7.2 Meaning of a locked skill

A locked skill means:

**This competency is not currently expected or prioritised at your level.**

It does not mean the user is prohibited from practising it.

Players should be able to explore advanced skills, particularly when introduced through coaching.

The application should avoid automatically classifying players as more advanced merely because they have practised an advanced technique.

## 7.3 Uneven player profiles

A player should not be expected to demonstrate identical proficiency across every domain.

Example:

- Serving: B
- Volleys: C
- Lobs: B
- Glass defence: D
- Tactical positioning: C

This variation is normal.

The overall proficiency estimate must therefore use clearly defined rules rather than a simplistic average of every skill.

# 8. Player Profile and Development Tracker

These are two linked views of the same competency structure.

The player profile describes a player's current abilities and development context.

The development tracker identifies what the player is actively trying to improve.

## 8.1 Personal development progress

Players can create and maintain development goals for individual competencies.

Each goal includes:

- Skill or competency.
- Personal objective.
- Current development status.
- Self-assessed progress percentage.
- Relevant coaching guidance.
- Notes.
- Linked match reflections.
- Development history.

Example:

**Skill:** Volleys  
**Objective:** Improve continental grip consistency and follow-through.  
**Progress:** 55%  
**Status:** Active  
**Evidence:** Recent coaching lesson and match reflections.

## 8.2 Meaning of progress

Progress measures **personal satisfaction with progress towards a defined goal**.

It does not directly measure technical proficiency.

A player can reach 100% without achieving advanced proficiency.

For example:

A player might complete the goal "Produce a controlled forehand volley with a consistent continental grip."

They may subsequently create another goal:

"Develop directional volley control under pressure."

Both goals concern volleying, but represent different stages of personal development.

## 8.3 Development statuses

Proposed statuses:

- Not started.
- Active.
- Improving.
- Satisfied / completed.
- Parked.
- Reopened.

A percentage and a status may coexist.

The percentage describes the user's satisfaction with progress; the status describes the goal's lifecycle.

## 8.4 Goal completion

When a goal reaches 100%, the user can mark it satisfied.

The goal moves into the development history.

It remains visible in the player's competency profile but no longer occupies an active development slot.

The player can reopen the goal or create a more advanced objective later.

Completed goals should never disappear from the history.

## 8.5 Active development priorities

The application should encourage a limited number of simultaneous goals.

Suggested default:

**Two or three active priorities.**

This helps players focus during matches instead of attempting to change every aspect of their technique at once.

## 8.6 Historical progression

A timeline could show:

- When a weakness was identified.
- When a goal was created.
- Coaching sessions linked to it.
- Match reflections referencing it.
- Self-assessed changes.
- Goal completion.
- Subsequent goals in the same area.

This allows players to understand how their game has developed over months or years.

# 9. Initial Player Assessment

New users should complete a short diagnostic assessment.

The diagnostic has two purposes:

1. Establish a provisional player profile.
2. Identify relevant development priorities.

## 9.1 Proposed onboarding process

**Step 1 — Playing background**

Collect basic context:

- Playing experience.
- Typical frequency of play.
- Coaching experience.
- Competitive experience.
- Existing self-reported level, if known.

**Step 2 — Broad competency screening**

Use simple can-do statements for fundamental skills.

**Step 3 — Adaptive follow-up**

Present additional questions relevant to the user's responses.

A user demonstrating higher competence in a domain may receive more advanced descriptors.

**Step 4 — Provisional proficiency profile**

Generate a domain-level profile and an overall provisional level, where sufficient information exists.

**Step 5 — Development goals**

Ask the player to identify the two or three things they most want to improve.

## 9.2 Assessment confidence

Initial results are based primarily on self-assessment.

The application must make this clear.

Proposed evidence classifications:

- Self-reported.
- Supported by repeated match reflections.
- Coach-observed.
- Supported by structured performance tasks.

These evidence categories should not automatically imply a numerical confidence score without validated weighting rules.

The system should be able to report that an assessment is provisional or that evidence is insufficient.

# 10. Match Centre

The Match Centre connects the user's development goals to actual competitive play.

A match has three phases:

1. Preparation.
2. Recording.
3. Reflection.

## 10.1 Pre-match preparation

Before a match, the user can:

- Select the partner.
- Select opponents.
- Record venue or conditions.
- Select development targets.
- Add tactical notes.

The application may suggest targets based on active development priorities.

Example:

**Today's targets**

1. Maintain continental grip during volleys.
2. Follow through when appropriate.
3. Avoid attempting low-percentage winners from the back of the court.

Players can accept, remove or change recommendations.

## 10.2 Match recording

The core match record should contain:

- Date.
- Partner.
- Opponents.
- Scores by set.
- Result.
- Venue, if relevant.
- Session type.
- Optional notes.

Possible session types:

- Casual game.
- Competitive game.
- League or tournament.
- Practice match.

Scorekeeping should remain quick and optional.

Live point-by-point tracking is outside the initial MVP.

## 10.3 Post-match reflection

After completing a match, the user enters a guided reflection.

The interface should feel conversational rather than like a long assessment form.

Suggested areas:

- General performance.
- Physical and mental readiness.
- Pre-match target achievement.
- Technical performance.
- Tactical decisions.
- Partnership and positioning.
- Positive moments.
- Difficulties.
- Next priorities.

## 10.4 Adaptive follow-up questions

The reflection should respond to the player's answers.

Example:

**Player:** My volleys were inconsistent.

**Padel IQ:** Was this mainly because of technique, preparation, positioning or pressure?

**Player:** I kept slipping back into my old grip.

**Padel IQ:** Did you notice this during fast exchanges, or throughout the match?

The application extracts structured observations from the conversation.

The user can review or correct them.

## 10.5 Linking observations to competencies

Match observations should reference relevant skills and active goals.

Example:

**Observation:** Grip reverted during fast volley exchanges.

**Linked competency:** Volley grip consistency.

**Linked development goal:** Maintain continental grip during volleys.

**Context:** Competitive match.

This allows recurring patterns to be identified over time.

## 10.6 Match history

The Match Centre should allow users to review:

- Results.
- Partners.
- Opponents.
- Match notes.
- Development targets.
- Reflections.
- Recurring patterns.
- Improvements and setbacks.

Wins and losses provide context, but should not automatically determine competency ratings.

# 11. Coaching Journal

Formal coaching sessions represent a valuable source of development evidence.

The Coaching Journal should allow players to record:

- Session date.
- Coach.
- Session duration.
- Skills practised.
- Drills.
- Technical feedback.
- Corrections.
- Positive developments.
- Homework or practice targets.

## 11.1 Linking coaching to goals

Example:

**Coaching focus:** Continental grip and volley follow-through.

**Relevant development goal:** Improve volley technique.

**Coach feedback:** Maintain a compact preparation and guide through the shot.

**Suggested match target:** Apply the corrected grip during competitive volleys.

The next match reflection can explicitly ask whether the coaching transferred into play.

## 11.2 Coaching-to-match transfer

This is a potentially distinctive feature.

Padel IQ could track the sequence:

**Coaching intervention → Practice → Match application → Reflection → Continued development**

This allows players to assess whether lessons are having a practical impact.

Initially, this would be based on player reflections rather than automated performance measurement.

# 12. AI Personal Coach

The AI Coach brings together the application modules.

It should be aware of:

- The player's provisional proficiency.
- Current competency profile.
- Active development goals.
- Completed goals.
- Coaching history.
- Match history.
- Reflection patterns.
- Known strengths and recurring weaknesses.

## 12.1 Core AI functions

### A. Match preparation

Suggest relevant, manageable targets before matches.

### B. Guided reflection

Conduct adaptive post-match conversations.

### C. Pattern recognition

Identify recurring themes across sessions.

### D. Development recommendations

Suggest priorities and relevant practice activities.

### E. Progress summaries

Explain how the player's development has changed over time.

### F. Natural-language questions

Allow users to ask questions such as:

- What should I work on this week?
- Are my volleys improving?
- Which weaknesses keep appearing in matches?
- What did my last coaching session focus on?
- Am I ready to move on from my current serve goal?
- What should I practise before my next match?

## 12.2 Grounded recommendations

AI feedback should be connected to recorded evidence.

Example:

"Across your last four match reflections, you mentioned difficulty defending rebounds from the back glass three times. This may deserve attention in your next coaching session."

This is preferable to an unsupported claim such as:

"Your glass defence is getting worse."

## 12.3 User control

The AI may suggest:

- Adjusting goal progress.
- Reopening a completed goal.
- Adding a new development priority.
- Reassessing a competency.
- Reviewing a potentially outdated proficiency estimate.

However, the user should approve changes to personal goals and self-assessments.

The AI should not silently rewrite the player's profile.

## 12.4 Limitations

The AI must understand that self-reported reflections are subjective.

It should not:

- Claim to have observed strokes it has not seen.
- Invent match statistics.
- Infer precise technical ability from match results alone.
- Assign definitive proficiency levels without appropriate evidence.
- Treat isolated poor performances as established weaknesses.
- Confuse a completed personal goal with technical mastery.

# 13. User Experience

The application should be mobile-first and quick to use around actual padel sessions.

## 13.1 Suggested navigation

**Home**

A personal development dashboard.

**My Game**

Skill profile, competency framework and development priorities.

**Matches**

Pre-match planning, match records and reflections.

**Coaching**

Lessons, observations and practice tasks.

**AI Coach**

Conversational analysis and personalised recommendations.

## 13.2 Home dashboard

The initial dashboard might include:

**My Level**

Current provisional proficiency and assessment status.

**Current Focus**

Two or three active development goals with progress indicators.

**Next Match**

Quick access to pre-match targets.

**Recent Activity**

Latest matches and coaching sessions.

**Coach Insight**

One relevant observation or suggestion.

The dashboard should avoid excessive statistics.

## 13.3 Skill profile

The profile could use expandable sections:

- Serving.
- Groundstrokes.
- Volleys.
- Defence and glass.
- Overheads.
- Movement.
- Tactics.
- Match management.

Each section shows:

- Competencies.
- Provisional proficiency.
- Current development goals.
- Personal progress.
- Relevant observations.
- Development history.

Advanced skills remain visible but visually de-emphasised or locked.

## 13.4 Design language

Proposed direction:

- Clean, contemporary sports interface.
- Minimal data entry.
- Clear competency labels.
- Visually distinct active and completed goals.
- Progress indicators.
- Historical trend views.
- Useful insights rather than decorative analytics.

The visual identity remains undecided.

# 14. Core User Journeys

## Journey A — First-time user

1. Creates a profile.
2. Completes a short background questionnaire.
3. Responds to adaptive competency descriptors.
4. Receives a provisional playing-level profile.
5. Reviews strengths and weaker areas.
6. Selects development priorities.
7. Arrives at a personalised dashboard.

**Desired result:** The user understands their starting point and what to focus on.

## Journey B — Before a match

1. Opens Match Centre.
2. Creates a match.
3. Selects partner and opponents.
4. Reviews suggested development targets.
5. Confirms two or three targets.
6. Leaves the app and plays.

**Desired result:** The player begins the match with a manageable development focus.

## Journey C — After a match

1. Opens the existing match.
2. Enters scores and details.
3. Completes a short AI-guided reflection.
4. Reviews extracted observations.
5. Confirms relevant development updates.
6. Receives a concise summary.

**Desired result:** The match becomes meaningful evidence of development.

## Journey D — After coaching

1. Records coaching session details.
2. Selects practised skills.
3. Captures coach feedback.
4. Links the lesson to existing goals.
5. Creates practice or match targets.
6. Reviews whether the technique transfers into later matches.

**Desired result:** Coaching remains part of an ongoing development process.

## Journey E — Completing a goal

1. Reviews a long-running goal.
2. Decides they are satisfied with their improvement.
3. Marks the goal 100% complete.
4. Moves it into completed history.
5. Chooses another development priority.

**Desired result:** The player experiences meaningful progress without being required to demonstrate elite mastery.

# 15. Performance Analytics

Analytics should emerge from meaningful records rather than requiring extensive manual statistical entry.

## 15.1 Development analytics

Examples:

- Active development priorities.
- Completed goals.
- Time spent working on particular competencies.
- Self-assessed goal progression.
- Frequently reported weaknesses.
- Recurring positive observations.
- Coaching-to-match transfer.

## 15.2 Match analytics

Examples:

- Match frequency.
- Win/loss record.
- Set results.
- Performance reflections by opponent.
- Performance reflections by partner.
- Development target outcomes.

The system should clearly distinguish numerical facts from qualitative interpretations.

## 15.3 Competency analytics

Examples:

- Current proficiency by domain.
- Changes following reassessment.
- Skills with limited assessment evidence.
- Skills that appear ready for reassessment.
- Areas where player confidence and match observations appear inconsistent.

## 15.4 Avoiding misleading conclusions

Small sample sizes, opponent variation, partner influence and subjective reports can distort conclusions.

Insights should use cautious language and show their supporting observations.

For example:

"Your recent reflections suggest improving confidence with your serve."

Not:

"Your serving accuracy improved by 24%."

A precise accuracy statistic requires actual serve-attempt and success data.

# 16. Preliminary Data Model

The system should use structured data that AI can retrieve and interpret.

Proposed entities:

| Entity | Purpose |
|---|---|
| User | Account and preferences |
| PlayerProfile | Playing background and current assessment |
| SkillDomain | Major competency category |
| Competency | Individual assessable skill |
| ProficiencyDescriptor | Observable expectations at different levels |
| CompetencyAssessment | Self-reported or externally supported ratings |
| DevelopmentGoal | Personal objective and progress |
| GoalProgressEvent | Dated changes and supporting notes |
| Match | Match metadata and results |
| MatchParticipant | Partners and opponents |
| MatchTarget | Pre-match development targets |
| MatchReflection | Post-match evaluation |
| Observation | Structured positive or negative evidence |
| CoachingSession | Coaching records |
| CoachingNote | Technical guidance and practice tasks |
| AIInsight | Generated analysis and supporting references |

## 16.1 Data relationships

- One user has one current player profile.
- A player profile contains many competency assessments.
- A competency can have multiple development goals over time.
- A development goal can link to multiple matches and coaching sessions.
- A match can contain multiple targets and observations.
- An observation can link to one or more competencies.
- AI insights reference the evidence from which they were generated.

These relationships are conceptual and will require technical refinement.

## 16.2 Structured reflections

AI conversations should produce data that can be stored consistently.

An observation might contain:

- Competency ID.
- Match or coaching-session ID.
- Observation type.
- Description.
- Context.
- Player-confirmed interpretation.
- Source.
- Timestamp.

The original reflection should remain available for context.

# 17. MVP — Minimum Viable Product

The first version should prove that players find structured personal development tracking useful.

It does not need every advanced analytical feature.

## 17.1 Recommended MVP features

### Essential

**1. Player onboarding**

Basic playing background and a short provisional competency assessment.

**2. Skill framework**

Defined categories and initial can-do descriptors.

**3. Player profile**

Current self-assessed skills and development priorities.

**4. Development goals**

Create, edit, update, complete and reopen goals.

**5. Match recording**

Record match details, scores and participants.

**6. Pre-match targets**

Associate development goals with an upcoming match.

**7. Post-match reflection**

A short structured reflection with optional conversational AI support.

**8. Coaching notes**

Capture lesson feedback and associate it with competencies.

**9. Basic AI coach**

Summarise known information and suggest relevant next steps.

**10. Development history**

Review progress, reflections and completed goals.

## 17.2 Excluded from MVP

- Live point-by-point scoring.
- Video stroke analysis.
- Computer-vision tracking.
- Automated stroke recognition.
- Partner accounts.
- Coach-facing dashboards.
- Club integrations.
- Tournament management.
- Social networking.
- Public leaderboards.
- Advanced matchmaking.
- Automated verified proficiency certification.

These features would increase complexity before the central value proposition has been validated.

# 18. Future Development Roadmap

## Phase 1 — Personal Development MVP

Establish the core assessment, development and match-reflection experience.

Success question:

**Do players find the app useful enough to update after their matches?**

## Phase 2 — Richer Player Intelligence

Potential features:

- More detailed competency coverage.
- Adaptive reassessment.
- Historical trends.
- Better AI pattern recognition.
- Partner and opponent comparisons.
- Training recommendations.
- Improved coaching-to-match tracking.

## Phase 3 — Coach Collaboration

Potential features:

- Coach accounts.
- Coach-created development goals.
- External competency assessments.
- Coach verification of skill descriptors.
- Shared coaching notes.
- Player development reports.

This creates opportunities for multiple perspectives on player ability.

## Phase 4 — Assessment Validation

Potential activities:

- Expert review of proficiency descriptors.
- Assessment calibration.
- Reliability analysis.
- Comparison with established competitive rankings.
- Investigation of discrepancies between self-assessment and coach assessment.
- Refinement of level boundaries.

An independently defensible proficiency framework could become a particularly valuable part of the product.

## Phase 5 — Advanced Features

Potential longer-term possibilities:

- Video uploads and annotated coaching feedback.
- AI-assisted stroke analysis.
- Practice-drill libraries.
- Training programmes.
- Club and academy dashboards.
- Assessment pathways for structured player development.

These are possibilities, not commitments.

# 19. Assessment Quality and Fairness

Because Padel IQ may suggest player levels, assessment quality requires particular attention.

## 19.1 Construct definition

The product must define what its proficiency ratings represent.

Technical execution, tactical understanding, consistency and match performance are related but distinct constructs.

An overall level should not simply represent confidence or win percentage.

## 19.2 Reliability

Equivalent performances should lead to broadly equivalent assessments.

Potential future validation methods include:

- Expert descriptor reviews.
- Repeated assessments.
- Coach agreement studies.
- Structured task evaluation.

## 19.3 Validity

Evidence should support the interpretations made from it.

For example, match results are useful competitive evidence but insufficient on their own to identify an individual player's technical competency.

## 19.4 Transparency

The user should be able to see:

- How a suggested proficiency level was derived.
- What evidence supports it.
- Which competencies have not been assessed.
- Whether the estimate is provisional.
- Why reassessment is recommended.

## 19.5 Self-assessment bias

Some players will overestimate themselves; others will underestimate themselves.

The application should treat initial self-assessment as a starting point.

Repeated reflection, structured tasks and optional coach observations can help improve the quality of the profile.

## 19.6 Levels versus personal goals

The proficiency framework and the development tracker must retain separate meanings.

**Proficiency:** The player's demonstrated or self-reported competence against defined criteria.

**Development progress:** The player's satisfaction with progress towards a self-selected objective.

A completed development goal does not automatically trigger promotion to another proficiency band.

# 20. AI and Data Safeguards

The product should establish clear rules for AI-supported feedback.

- User assessments must not be silently overwritten.
- AI-generated insights should be traceable to their underlying records.
- Missing evidence should be identified rather than invented.
- Generated summaries should be editable or correctable.
- Users should be able to delete their match and coaching records.
- Personal playing records should remain private by default.
- Sharing with coaches or other players should require explicit permission.
- The product should communicate that an AI coach cannot replace direct technical observation by a qualified human coach.

Where possible, structured database queries should provide the evidence used by AI responses.

The AI should not rely solely on unstructured conversation memory.

# 21. Potential Differentiators

Padel IQ may distinguish itself through five combined characteristics.

## 21.1 Competency-based classification

Player levels are explained through transparent behavioural descriptors.

## 21.2 Personal development satisfaction

Players decide when they have achieved their own goals rather than pursuing endless arbitrary improvement percentages.

## 21.3 Match-to-learning connection

Pre-match goals and post-match reflections connect competitive play to intentional development.

## 21.4 Coaching continuity

Technical guidance remains connected to subsequent practice and match performance.

## 21.5 Context-aware AI

Recommendations are informed by the player's history instead of generic coaching prompts.

The combined system is potentially more distinctive than any individual feature.

# 22. Success Metrics

For the initial personal prototype, success should be measured by usefulness and continued engagement rather than monetisation.

Possible metrics include:

- Percentage of registered users completing onboarding.
- Percentage selecting active development goals.
- Matches recorded per active player.
- Percentage of recorded matches with reflections.
- Frequency of goal updates.
- Coaching sessions linked to development goals.
- Repeat usage after four and eight weeks.
- User-reported usefulness of AI recommendations.
- User-reported clarity about development priorities.

A particularly useful qualitative question would be:

**Does Padel IQ help the player know what to focus on during their next match?**

# 23. Open Product Decisions

The following questions require exploration before implementation.

### Assessment framework

- How many proficiency levels are necessary?
- Should letter grades have subdivisions?
- What specific observable criteria distinguish each level?
- How should technical and tactical domains contribute to an overall level?
- Should an overall level be displayed when evidence is incomplete?
- How should the framework accommodate uneven skill profiles?

### Skill development

- Should progress percentages be adjusted manually, or supported by milestones?
- Can multiple goals exist within one skill area?
- How should parked, completed and reopened goals appear?
- How many active goals should the application recommend?

### Match reflection

- How many questions should a typical reflection contain?
- Should reflection begin with structured choices or free conversation?
- How much information should be extracted automatically?
- How can reflection remain useful without becoming repetitive?

### AI coaching

- When should the AI proactively offer feedback?
- How should the system identify recurring problems?
- What minimum evidence should support recommendations?
- When should the app suggest reassessment?
- How should conflicting observations be handled?

### Product experience

- How much of the skill framework should be visible initially?
- Should advanced skills be locked, faded or simply deprioritised?
- How should the interface distinguish personal progress from proficiency?
- What motivates users to continue after the initial novelty wears off?

# 24. Recommended Next Steps

The concept should be developed in the following order.

**Step 1 — Define the assessment framework**

Create the competency taxonomy, draft can-do descriptors and specify the meaning of each proficiency band.

**Step 2 — Design the player profile**

Determine how the framework appears to the user, including locked skills, domain-level assessments and active development goals.

**Step 3 — Define development-goal behaviour**

Clarify progress, completion, reassessment, archiving and historical tracking.

**Step 4 — Design the match workflow**

Prototype pre-match preparation, match recording and post-match reflection.

**Step 5 — Specify the AI coach**

Establish what information it can access, how it should interpret evidence and how it recommends actions.

**Step 6 — Test the concept**

Use realistic player scenarios and historical match reflections to assess whether the framework and workflows produce useful outcomes.

**Step 7 — Build a constrained prototype**

Implement only the minimum functionality necessary to test the central user experience.

---

# 25. Final Product Positioning

**Padel IQ — Understand your game. Develop with purpose.**

Padel IQ is a personal padel-development platform that combines competency-based assessment, personalised improvement goals, match reflection and AI-supported coaching.

It helps recreational players identify where they are, understand what they are working on, recognise their progress and decide what to focus on next.

Rather than measuring success solely through rankings or match outcomes, Padel IQ makes the process of becoming a better player visible.

**Central philosophy:**

*Know your game. Own your progress. Improve with purpose.*

---

**Document status:** Initial concept brief. Assessment descriptors, level boundaries, AI behaviours and technical decisions remain provisional and require further design and validation.
# PadelIQ player framework revision

Version 3.0 player draft · 26 October 2026

This revision restores the intended player experience: five areas, familiar Beginner/D/C/B/A anchors, a short checklist and useful questions after a match. It corrects content rather than requiring a coach assessment before the player can use the app.

## What is included

- `2-framework/padel-iq-skills.csv`: 145 rows covering 46 skills, in Attack, Defence, Movement, Tactics and teamwork, and Mentality.
- `2-framework/change-notes.csv`: 450 field-level changes and additions with before/after text and source IDs.
- `2-framework/original-content.csv`: all 112 original records preserved, including multiline statements.
- `2-framework/sources.md`: checked references and the limits of what they support.
- `2-framework/validation-protocol/`: the earlier coach-assessment draft and review, plus instructions separating them from the player experience.

The five areas remain suitable as the five axes of the existing pentagon. Beginner, D, C, B and A remain the player's framework labels. No numerical conversion to a club or app rating has been added.

## Main content changes

1. Aligned defensive-lob, passing-shot, beginner-positioning and other descriptions with their self-statements. A claim now includes the relevant context, such as an easy ball or time to prepare.
2. Split groundstrokes and volleys into forehand and backhand, while keeping the same concise language.
3. Replaced pair-outcome claims with the individual player's action, including movement, communication and net play.
4. Corrected serve depth to mean inside the service box, made advances after lobs/chiquitas conditional, and removed the instruction to retrieve an x4 outside.
5. Added second serve, fence rebound, middle-ball responsibility, and rules/scoring.
6. Completed the truncated B/A progressions for readiness, general overhead control and focus. Lower anchors are not fabricated for every advanced variant.
7. Kept Mentality in the five-area profile, but rewrote it around preparation, reset and attention actions. These are PadelIQ performance behaviors, not judgments of calmness, personality or clinical state.
8. Marked 21 rows as optional shot variants or specialists. x3 has B/A anchors; x4 now also has an introductory B anchor. Neither is a condition for reaching a level.
9. Retained 59 nonblank original warning-question instances unchanged. Other questions were corrected or made specific to the separated wing. Questions with blanks in the source may remain blank; there is no generic replacement question imposed everywhere.

## Player use

Keep the existing checklist approach. Ask players to think about ordinary recent games rather than their best-ever shot. A checked statement is a self-report, not verified attainment. If the app supports an Unsure or Not tried answer, keep it distinct from No. A useful after-match question can point to one practice focus without asking the player to re-complete the whole quiz.

Statements define capabilities or behaviors. Goals belong in the player's separate plan: for example, “Over my next three matches, notice when a rushed lob lands short and try one preparation cue.” Recording that goal does not check off a lob competency. App-use streaks or practice attendance are not evidence of playing strength.

## Level and pentagon integration

The level and five-axis profile are retained as product concepts. This package does not replace them with coach-only grading. It also does not invent a new overall-level formula: no application code or existing formula was supplied here.

For integration, retain the existing presentation and review the following data assumptions:

- The first 14 CSV columns keep their original names and order. Five metadata columns follow: Record ID, Record type, Optional, Source row IDs, and Change notes.
- `Expected at this level` is now `Yes` or `Optional`. An importer must explicitly honor Optional. Merely loading the text will not remove an optional item from a scoring formula.
- An optional item must be excluded from BOTH the required-item numerator and denominator. An unchecked optional item must not cap a level, and having more optional shots must not automatically inflate it.
- Three rescue/outside catalog rows use `Level=Optional` rather than a blank. Filter them out of Beginner/D/C/B/A requirements.
- New split-wing skill names replace the combined names. Do not duplicate a previous combined Yes into both wings as if both had been independently answered. Reconfirm the wings separately when migrating saved answers.
- Mentality remains an axis, explicitly representing reported performance behavior. Describe the overall result as a PadelIQ self-assessed profile/level, not a validated competitive rating. How Mentality affects an existing overall calculation needs to be visible and deliberate; it should not be confused with a directly observed shot capability.
- Skills with fewer level rows should not be treated as five missing answers. Preserve the existing handling of stage-specific items and test it with the new data.
- More rows do not justify giving one area more weight. Review how the existing formula handles split wings and the added rows before interpreting before/after score changes as player improvement.

No live app, admin interface, quiz, migration or pentagon was changed or tested in this workspace. These files are prepared for integration; they are not evidence of a working app update.

## Verification completed

The CSV was exported and read back with exact value equality. Checks passed for five area values, unique IDs, nonblank level/descriptions/statements, all 112 source IDs accounted for, exact preservation of the source archive, optional flags, and individual rather than pair-based statement openings. Checks also confirm that the misleading back-glass serve claim and “Mistakes don't change how I play” are absent from the player statements.

These checks verify file structure and selected editorial requirements. They do not prove player-level accuracy or complete linguistic consistency. Coach and player review remain the next step.

UTF-8 with BOM preserves Spanish text for common Excel imports. Proper CSV quoting preserves commas and embedded line breaks. Record numbers refer to CSV records, not physical text lines.

The earlier coach package is retained only under validation-protocol. Its mandatory observation procedure and exclusions from global grading are not requirements for this player version. Neither draft has been field-validated.

# Padel IQ: Onboarding (draft v0.2)

Goal: a starting level in about 3 minutes. It is a first estimate, and the player can change it.

## The mascot asks
The chalk mascot asks every question, one per screen, in a short speech bubble, with big tap answers underneath. Friendly, plain words, no jargon. Poses: wave (welcome), thinking (questions), thumbs up (result), shrug (skip).

## Steps
1. **Welcome + disclaimer.** "This is a starting estimate, not an official rating. You can change it any time."
2. **About you** (all quick taps, all skippable)
   - How long have you played? (under 6 months / 6-12 months / 1-3 years / 3+ years)
   - How often? (less than weekly / 1x / 2x / 3x+)
   - Other racket sports? (none / tennis / squash / badminton / other)
   - Playtomic level, if you have one (type a number, or skip)
   - Your club's level, if you have one (D, C, B... plus country or club name, or skip)
3. **Five quick questions**, one per area (Attack, Defence, Movement, Tactics, Mentality). Each uses "shot and situation" answers, e.g. "My bandeja lands deep when I'm calm, but not when I'm rushed."
4. **Your starting level.** Pentagon + one level. Mascot asks "Does this feel right?" Buttons: Feels right / Not quite. Not quite lets the player pick their own level.
5. **Want to be more accurate?** "Answer more questions" (pick an area, 3-4 questions each) or "Go to Home".

## Level note (shown on the result screen, and again in More > About levels)
"A, B, C, D mean different things at different clubs and in different countries. Your level here is based on the skills checklist in this app. It may not match your local club's level, and that's fine."

## Rules (draft)
- Playtomic level and club level are **hints only**. They set where the questions start. The skill answers decide the level.
- Six answers per question map to Beginner, D, C, B, A, Pro (lowest to highest). Each area takes the average of its two answers, rounded to nearest. A self-rating stops at A. Rough hint mapping for Playtomic (TO CHECK with real players): under 1.5 Beginner, 1.5-2.5 D, 2.5-3.5 C, 3.5-5 B, 5+ A.
- If the player adjusts the level, we keep their choice and mark it "set by you". Their skill answers stay as they are.
- If answers and the chosen level are far apart, show one gentle note once. No nagging.
- Every start is marked "provisional" until the first check-in (after 5 matches).

## What gets saved
Player: yearsPlaying, playsPerWeek, otherSports, playtomicLevel, clubLevel (text), country/club (text), startingLevel, levelSetByPlayer (yes/no), provisional (yes/no), onboardingDate.
Skill answers: the same records as check-ins, tagged "onboarding".

## Open
2. Mascot lines: write them in a friendly, short voice (draft after the questions).
3. Does a coach friend review the five questions?

## The 10 questions (v0.1, approved by Richard as the starting set, two per area, mascot voice)
Each has 6 answers, from beginner up to pro (Beginner, D, C, B, A, Pro). The 4-answer wording above is the earlier version; the live wording is in 5-data/onboarding.json plus "Not sure". The wording is a first try. Check with coaches.

**Attack**
1. Serve (serve): "How's your serve going?"
   a) I'm just getting it in. b) Mostly in, but soft. c) In most of the time, I can aim it. d) Deep and aimed, and I mix it up.
2. Bandeja (bandeja): "When the lob comes, what do you do?"
   a) I let it bounce or hit it hard and hope. b) I try a bandeja but it's hit and miss. c) Mostly a steady bandeja that keeps me at the net. d) Bandeja, vibora or bajada, depending on the ball.

**Defence**
3. Return of serve (return_of_serve): "Returning the serve?"
   a) I get it back sometimes. b) Most come back, with no plan. c) Most come back low and to a target. d) I choose the return before the serve arrives.
4. Back glass (back_glass_return): "When the ball comes off the back wall?"
   a) I usually miss it or panic. b) I can return the easy ones. c) I read most and return them deep. d) I use the wall to my advantage, even on hard ones.

**Movement**
5. Net play (net_play): "How often do you get to the net?"
   a) Rarely. b) When my partner is there. c) I take it often and hold it. d) I take it back after lobs and keep it.
6. Moving as a pair (moving_as_pair): "You and your partner..."
   a) Often end up in the same spot. b) Move OK when the ball is slow. c) Mostly move together. d) Move as one, including when we change sides.

**Tactics and teamwork**
7. Shot choice (shot_choice): "Which shot do you pick?"
   a) Whatever I can reach. b) Whatever I like best. c) I think about where the opponents are. d) I build the point and pick on purpose.
8. Talking to your partner (partner_communication): "Do you talk during a match?"
   a) Hardly. b) Mostly "mine" and "yours". c) Yes, and we agree a plan before we start. d) We adjust the plan mid-match.

**Mentality**
9. Composure (composure): "At 5-5 in a tight set?"
   a) I tighten up and make mistakes. b) It depends on the day. c) I stay mostly calm. d) I play the same as at 0-0.
10. Bouncing back (bouncing_back): "After a bad point or a run of mistakes?"
   a) It carries on for a long time. b) I get annoyed but recover after a few points. c) I reset by the next point. d) I use a routine to reset.

Note: the answers are placeholders to react to. The final skill checks (levels, "shot and situation") are the framework's job.

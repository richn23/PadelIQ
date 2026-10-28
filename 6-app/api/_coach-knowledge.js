// Copied from 5-data/coach-knowledge.json by npm run sync-prompts. Edit that file, not this one.
export default {
 "_note": "PadelIQ coaching notes. Written in our own words from published coaching guides, FIP rules and sport-science studies. Research-based; NOT yet validated by a qualified coach. Strength = how well the research supports it (strong/moderate/limited). Edit this file, not 6-app/api/_coach-knowledge.js.",
 "cards": [
  {
   "id": "serve",
   "name": "Serve (saque)",
   "category": "attacking",
   "strength": "strong",
   "keywords": [
    "serve",
    "saque",
    "double fault",
    "service"
   ],
   "facts": [
    "Underhand, struck after a bounce, at or below waist height (the rule).",
    "Keep it simple, repeatable and well directed; reliability and placement matter more than pace.",
    "A controlled slice can keep the ball lower after it bounces.",
    "The serve should set up moving toward the net without rushing."
   ],
   "mistakes": [
    "Chasing pace and losing control",
    "Changing the swing after a fault",
    "Tension in the arm or hand"
   ],
   "ask": [
    "Where does the ball go when it misses: net, long, or wide?",
    "Does it change after a fault or on big points?"
   ],
   "avoid": [
    "Do not prescribe power. Do not say a fault means a technical problem if it is nerves.",
    "A worse serve at close scores is not proof of nerves. Ask whether they felt tight or rushed before suggesting pressure."
   ],
   "sources": [
    "The Padel School",
    "FIP rules"
   ],
   "causes": [
    [
     "Serve is slow and loopy",
     "too much upward swing, unsuitable contact, a hesitant action, poorly controlled flight",
     "Is it lacking pace, or is the returner simply getting a comfortable high ball?"
    ],
    [
     "First serve faults too often",
     "too much pace or spin, inconsistent ball drop, a rushed action",
     "Is it accuracy, mechanics, or choosing too much risk?"
    ]
   ],
   "practice": [
    "Serve repeatedly to chosen targets, starting with a simple consistent action before adding variation."
   ]
  },
  {
   "id": "second_serve",
   "name": "Second serve (segundo saque)",
   "category": "attacking",
   "strength": "strong",
   "keywords": [
    "second serve",
    "segundo saque",
    "double fault"
   ],
   "facts": [
    "Same legal rules as the first serve.",
    "Advice: do not make the first serve so aggressive that the second is too soft; do not let the second be so passive that opponents attack it.",
    "Prioritise reliable placement and a repeatable action."
   ],
   "mistakes": [
    "A much softer second serve than the first",
    "Fear of the double fault changing the action"
   ],
   "ask": [
    "What do you do differently on the second serve?"
   ],
   "avoid": [
    "Do not tell them to just go slower."
   ],
   "sources": [
    "The Padel School"
   ],
   "causes": [
    [
     "Second serve gets attacked",
     "too soft or too predictable",
     "Is the issue placement or pace?"
    ]
   ]
  },
  {
   "id": "forehand_volley",
   "name": "Forehand volley (volea de derecha)",
   "category": "attacking",
   "strength": "strong",
   "keywords": [
    "forehand volley",
    "volea de derecha",
    "volley",
    "volleys"
   ],
   "facts": [
    "Racket up and ready, shoulders turned, stable base, contact in front.",
    "Compact swing with a controlled follow-through.",
    "A big backswing or a poor ready position cuts reaction time and control."
   ],
   "mistakes": [
    "Big backswing",
    "Racket dropped low or behind the body",
    "Contact too close to the body"
   ],
   "ask": [
    "Where does the ball go wrong: long, into the net, or popping up?",
    "What kind of ball is it: fast at you, shoulder height, or low?"
   ],
   "avoid": [
    "Do not say \"always block\". A short action suits some balls; others need placement or a little more."
   ],
   "sources": [
    "The Padel School"
   ],
   "causes": [
    [
     "Forehand volley floats long",
     "open racket face, swing path, too much racket speed, late preparation",
     "Does it happen against fast balls or when trying an aggressive volley?"
    ]
   ],
   "depends": [
    "Racket path, face angle and speed are separate variables: ask which one seems off before giving a fix.",
    "A strong volley is not always a better one: controlled volleys build the point, aggressive ones finish it. Check the ball is suitable before adding pace."
   ],
   "practice": [
    "Feed a controlled setup volley followed by an easier ball to finish.",
    "First volley: practise the serve-to-net move and treat the first volley as a setup shot, not a finisher."
   ]
  },
  {
   "id": "backhand_volley",
   "name": "Backhand volley (volea de revés)",
   "category": "attacking",
   "strength": "strong",
   "keywords": [
    "backhand volley",
    "volea de revés",
    "volea de reves",
    "volley",
    "volleys"
   ],
   "facts": [
    "Early preparation, shoulder turn, balanced forward movement, short racket action.",
    "Slice can keep the next bounce lower.",
    "How aggressive to be depends on ball height, pace and where the opponents are, not just how hard the player can swing."
   ],
   "mistakes": [
    "Late preparation",
    "Swinging instead of punching forward",
    "Wrist or elbow collapsing"
   ],
   "ask": [
    "Is it popping up, going long, or into the net?",
    "Is the ball coming fast at your body or is it slower and higher?"
   ],
   "avoid": [
    "Do not give one fix for every volley."
   ],
   "sources": [
    "The Padel School"
   ],
   "causes": [
    [
     "Backhand volley pops up",
     "face angle or contact, late preparation, wrong swing size",
     "Is it low balls, balls at the body, or higher attacking balls?"
    ]
   ],
   "depends": [
    "Ball height, available time and the opponents' positions decide how aggressive to be."
   ]
  },
  {
   "id": "block_volley",
   "name": "Block volley (volea bloqueada)",
   "category": "attacking",
   "strength": "strong",
   "keywords": [
    "block volley",
    "volea bloqueada",
    "block",
    "fast ball",
    "hard hit",
    "bomb"
   ],
   "facts": [
    "A defensive volley against pace: expect the hard shot, prepare compactly and redirect into a safe space.",
    "The aim can be to survive and keep or regain the net, not to hit a winner."
   ],
   "mistakes": [
    "Trying to counter-attack a fast ball",
    "Swinging when jammed"
   ],
   "ask": [
    "Is the ball coming at your body, or wide?",
    "Are you trying to win the point or just stay in it?"
   ],
   "avoid": [
    "Do not suggest hitting back harder."
   ],
   "sources": [
    "The Padel School"
   ],
   "practice": [
    "Prepare against stronger incoming attacks with compact readiness and controlled blocks into space."
   ]
  },
  {
   "id": "drop_volley",
   "name": "Drop volley (dejada de volea)",
   "category": "attacking",
   "strength": "limited",
   "keywords": [
    "drop volley",
    "dejada de volea"
   ],
   "facts": [
    "Advanced option with soft contact and precise placement near the net.",
    "Depends on opponents' depth, the incoming ball height and being able to disguise it."
   ],
   "mistakes": [
    "Attempting it when opponents are close to the net"
   ],
   "ask": [
    "What is happening to the ball, and where are the opponents when you try it?"
   ],
   "avoid": [
    "Evidence is thin: do not give contact mechanics. Ask what happens and suggest showing a coach."
   ],
   "sources": [
    "The Padel School"
   ]
  },
  {
   "id": "basic_overhead",
   "name": "Basic overhead (remate básico)",
   "category": "attacking",
   "strength": "moderate",
   "keywords": [
    "overhead",
    "remate",
    "lob comes",
    "overheads",
    "under a lob"
   ],
   "facts": [
    "Spot the lob early, turn side-on and get into a balanced hitting position.",
    "Tell controllable overheads apart from lobs that need a defensive retreat.",
    "Contact position, balance and shot choice are the key points."
   ],
   "mistakes": [
    "Hitting an overhead off balance",
    "Not deciding early whether to attack or defend"
   ],
   "ask": [
    "Is it the decision, the movement, or the contact that goes wrong?",
    "How deep and high is the lob usually?"
   ],
   "avoid": [
    "No absolute rules like \"always let it bounce\" or \"always smash\"."
   ],
   "sources": [
    "The Padel School"
   ],
   "depends": [
    "The choice between smash, bandeja, víbora, gancho and a back-glass recovery depends on the lob, not just the swing. Find out why they chose the shot before assuming the swing is wrong."
   ],
   "practice": [
    "Decision before execution: before a fed lob, say whether you will smash, play a controlled overhead or retreat, then compare with what the ball actually did."
   ]
  },
  {
   "id": "bandeja",
   "name": "Bandeja",
   "category": "attacking",
   "strength": "strong",
   "keywords": [
    "bandeja",
    "overhead",
    "tray"
   ],
   "facts": [
    "A controlled overhead to keep the net, not a smash.",
    "Move back early, make contact in front, control pace and direction, then recover.",
    "Common placements are the corners and the middle. There are several legitimate technical variations.",
    "Aiming at the opponents' feet is a volley idea, not a bandeja target."
   ],
   "mistakes": [
    "Swinging at it like a smash",
    "Starting to move back late",
    "Contact behind the head"
   ],
   "ask": [
    "Where does it go wrong: net, too short, too deep, or off the back glass?",
    "Does it happen when you are backing up or when you are set?"
   ],
   "avoid": [
    "Do not say to aim at the feet. Do not prescribe one swing for everyone."
   ],
   "sources": [
    "The Padel School",
    "Padel Magazine"
   ],
   "causes": [
    [
     "Bandeja hits the net",
     "contact position, preparation, swing path, or choosing a bandeja for a lob that is too hard to control",
     "Are you balanced enough to attempt it, or should you defend?"
    ],
    [
     "Bandeja bounces too high",
     "contact too far behind or too high, too much power, wrong swing path",
     "Does the ball land badly, or land well but rebound too comfortably?"
    ]
   ],
   "depends": [
    "Teachers differ (chest-driven versus arm-driven, playing side). Don't prescribe one 'correct' swing; stay with the basics: early prep, suitable contact, control, recovery."
   ],
   "practice": [
    "Fed lobs: turn early, get behind the ball and recover toward the net; video can show contact and movement."
   ]
  },
  {
   "id": "vibora",
   "name": "Víbora",
   "category": "attacking",
   "strength": "strong",
   "keywords": [
    "vibora",
    "víbora",
    "sliced overhead"
   ],
   "facts": [
    "An attacking sliced overhead, often sent toward a corner.",
    "Contact height changes the flight and the rebound.",
    "Get behind the ball and manage speed and spin; maximum power is not needed."
   ],
   "mistakes": [
    "Confusing it with a bandeja or a smash",
    "Going for pace over control"
   ],
   "ask": [
    "Which shot do you mean: the controlled one to keep the net, or the faster sliced one?"
   ],
   "avoid": [
    "Do not mix it up with the bandeja."
   ],
   "sources": [
    "The Padel School"
   ]
  },
  {
   "id": "smash",
   "name": "Smash (remate)",
   "category": "attacking",
   "strength": "moderate",
   "keywords": [
    "smash",
    "remate",
    "overhead",
    "going long",
    "out the back",
    "full power"
   ],
   "facts": [
    "Best when a lob gives a real attacking chance (short and high enough).",
    "Contact position, balance, placement and controlled power matter.",
    "Points are lost by going for a full-power finish on balls that are not suitable."
   ],
   "mistakes": [
    "Full power on every ball",
    "Smashing balls that should be controlled with a bandeja",
    "Contact behind the head"
   ],
   "ask": [
    "Where does the ball go when it misses: long, net, or into the glass?",
    "What kind of lob is it: short and high, or deep?"
   ],
   "avoid": [
    "Do not tell them to stop and breathe mid-rally. Pre-point routines are fine."
   ],
   "sources": [
    "The Padel School"
   ],
   "causes": [
    [
     "Smash goes long",
     "too much power, poor control of the flight, or choosing to finish a ball that wasn't suitable",
     "Was the lob genuinely suitable for a finishing smash?"
    ]
   ]
  },
  {
   "id": "gancho",
   "name": "Hook (gancho)",
   "category": "attacking",
   "strength": "limited",
   "keywords": [
    "gancho",
    "hook"
   ],
   "facts": [
    "An alternative overhead for certain lob paths, including balls on the non-dominant side.",
    "It is about keeping control of the court more than finishing the point."
   ],
   "mistakes": [
    "Using it when a simpler shot is available"
   ],
   "ask": [
    "Which ball makes you want to use it: where is it going and how high?"
   ],
   "avoid": [
    "Evidence is thin: do not coach technique. Ask what happens and suggest a coach."
   ],
   "sources": [
    "The Padel School"
   ]
  },
  {
   "id": "topspin_smash",
   "name": "Topspin smash (remate liftado)",
   "category": "attacking",
   "strength": "strong",
   "keywords": [
    "topspin smash",
    "remate liftado",
    "topspin"
   ],
   "facts": [
    "An advanced overhead that uses topspin for a more aggressive bounce.",
    "Needs deliberate racket preparation, suitable contact and follow-through; different from a flat smash."
   ],
   "mistakes": [
    "Trying it before the flat smash is reliable"
   ],
   "ask": [
    "Is your flat smash going in reliably yet?"
   ],
   "avoid": [
    "Do not suggest it for players who are not yet consistent."
   ],
   "sources": [
    "The Padel School"
   ]
  },
  {
   "id": "por_tres",
   "name": "Smash x3 (por tres)",
   "category": "attacking",
   "strength": "moderate",
   "keywords": [
    "x3",
    "por tres",
    "three metre",
    "over the side"
   ],
   "facts": [
    "An attacking smash meant to leave the court over the three-metre side enclosure after a legal bounce.",
    "Spin, trajectory, rebound and the right ball matter. It is not a normal flat smash."
   ],
   "mistakes": [
    "Treating it as the same as an ordinary smash"
   ],
   "ask": [
    "Does your ordinary smash go in reliably yet?"
   ],
   "avoid": [
    "Advanced: do not suggest unless they ask and are consistent."
   ],
   "sources": [
    "The Padel School",
    "SCUD"
   ]
  },
  {
   "id": "por_cuatro",
   "name": "Smash x4 (por cuatro)",
   "category": "attacking",
   "strength": "moderate",
   "keywords": [
    "x4",
    "por cuatro",
    "four metre"
   ],
   "facts": [
    "Usually a flatter, forceful smash from a good forward position, sent beyond the four-metre back enclosure after a bounce.",
    "The geometry and execution differ from the x3."
   ],
   "mistakes": [
    "Treating it as the same as an ordinary smash"
   ],
   "ask": [
    "Does your ordinary smash go in reliably yet?"
   ],
   "avoid": [
    "Advanced: do not suggest unless they ask and are consistent."
   ],
   "sources": [
    "The Padel School",
    "SCUD"
   ]
  },
  {
   "id": "bajada",
   "name": "Bajada de pared",
   "category": "attacking",
   "strength": "strong",
   "keywords": [
    "bajada",
    "bajada de pared",
    "off the back glass overhead",
    "smash after the bounce"
   ],
   "facts": [
    "An attacking shot after the ball bounces off the back glass, usually after a lob.",
    "Read the rebound early, get behind the ball where you can, and make contact in front.",
    "A central placement is one coached option."
   ],
   "mistakes": [
    "Hitting too early before the rebound",
    "Going for power from a bad position"
   ],
   "ask": [
    "Do you have time to get behind the ball, or are you stretched?"
   ],
   "avoid": [
    "Do not confuse it with the bandeja."
   ],
   "sources": [
    "The Padel School"
   ],
   "depends": [
    "Not every back-glass ball suits a bajada: height, balance and the opponents' positions decide."
   ],
   "practice": [
    "Defend the corner, then attack off the back glass, to practise switching from defending to attacking."
   ]
  },
  {
   "id": "drop_shot",
   "name": "Drop shot (dejada)",
   "category": "attacking",
   "strength": "moderate",
   "keywords": [
    "drop shot",
    "dejada",
    "dropshot"
   ],
   "facts": [
    "A soft attacking option that is hard to reach near the net.",
    "Choosing the moment matters as much as the touch: the opponents' positions, the incoming ball and where the player is decide whether it is sensible.",
    "Detailed contact mechanics are not well documented yet."
   ],
   "mistakes": [
    "Trying it from the back when opponents are close to the net",
    "Using it to finish rather than to change the pattern"
   ],
   "ask": [
    "Where are you and where are they when you try it?",
    "Does it float over the net, or bounce up after landing?"
   ],
   "avoid": [
    "Do not give contact mechanics. Focus on when to use it, and suggest showing a coach for technique."
   ],
   "sources": [
    "The Padel School"
   ],
   "causes": [
    [
     "Drop shot gets attacked",
     "too much height, no disguise, the wrong incoming ball, or opponents close enough to recover",
     "Is this an execution problem or a shot-choice problem?"
    ]
   ]
  },
  {
   "id": "return",
   "name": "Return of serve (resto)",
   "category": "defensive",
   "strength": "strong",
   "keywords": [
    "return",
    "resto",
    "return of serve"
   ],
   "facts": [
    "Played after the serve bounces.",
    "Against a hard serve a controlled block is fine; an easier serve gives a chance for a lob, a chiquita or a purposeful deeper return.",
    "The aim is often to cancel out the serving pair's advantage."
   ],
   "mistakes": [
    "Being late on fast serves",
    "Trying to hit a winner"
   ],
   "ask": [
    "Is it fast first serves or all serves? Where does it go wrong?"
   ],
   "avoid": [
    "No single technique for every serve.",
    "When someone says 'I always miss my return', don't jump to a swing fix; first find out which serves and whether they hesitate over the glass rebound."
   ],
   "sources": [
    "The Padel School",
    "FIP rules"
   ],
   "causes": [
    [
     "Return goes into the net",
     "late decision, poor preparation, poor contact, or trying to attack a difficult serve",
     "Is the serve going toward the glass or more central?"
    ]
   ],
   "depends": [
    "Difficult serve toward the side glass: play a simple, controlled return.",
    "Difficult serve toward the T: a higher defensive lob may buy recovery time.",
    "Easier central serve: a return to the server's feet or an attacking lob can work.",
    "Comfortable return and opponents out of place: a more ambitious transition becomes possible."
   ],
   "drills": {
    "technique": "Returns to a deep target from a feed, focusing on a simple, early preparation.",
    "decision": "Server varies placement; you decide before the ball arrives: lob, low and deep, or at the feet.",
    "match": "Pick one return target for the set and stick with it for a few games.",
    "basis": "proposed and unverified (our own adaptation, not coach-reviewed)"
   }
  },
  {
   "id": "forehand",
   "name": "Forehand (derecha)",
   "category": "defensive",
   "strength": "moderate",
   "keywords": [
    "forehand",
    "derecha",
    "groundstroke"
   ],
   "facts": [
    "Core back-court shot: preparation, a stable position, space at contact and a controlled flight.",
    "More detail on padel-specific technique is still needed."
   ],
   "mistakes": [
    "Late preparation",
    "Crowded contact"
   ],
   "ask": [
    "What happens to the ball: too short, too long, or no pace?"
   ],
   "avoid": [
    "Evidence is moderate: stay general, no detailed mechanics."
   ],
   "sources": [
    "The Padel School"
   ]
  },
  {
   "id": "backhand",
   "name": "Backhand (revés)",
   "category": "defensive",
   "strength": "moderate",
   "keywords": [
    "backhand",
    "revés",
    "reves",
    "groundstroke"
   ],
   "facts": [
    "A reliable defensive shot from the back: preparation and control.",
    "Grip and one- or two-handed choice are personal; more detail is needed before prescribing mechanics."
   ],
   "mistakes": [
    "Late preparation",
    "Reaching"
   ],
   "ask": [
    "What happens to the ball: too short, too long, or no pace?"
   ],
   "avoid": [
    "Evidence is moderate: stay general, no detailed mechanics."
   ],
   "sources": [
    "The Padel School"
   ]
  },
  {
   "id": "lob",
   "name": "Defensive lob (globo)",
   "category": "defensive",
   "strength": "strong",
   "keywords": [
    "lob",
    "globo",
    "lobbed",
    "getting lobbed",
    "lobs"
   ],
   "facts": [
    "Creates time, pushes opponents back from the net and relieves pressure.",
    "Depth and height matter; a short lob gives an easy overhead.",
    "Balanced preparation and a controlled upward contact."
   ],
   "mistakes": [
    "Short or low lob",
    "Lobbing every ball",
    "Off-balance contact"
   ],
   "ask": [
    "Where does the lob land when it fails: short, or out?",
    "Are you lobbing because of pressure or by habit?"
   ],
   "avoid": [
    "Do not say \"always lob\" or \"never lob\"."
   ],
   "sources": [
    "The Padel School"
   ],
   "causes": [
    [
     "Defensive lob falls short",
     "not enough height or depth, a rushed contact, or the wrong ball for it",
     "Were you under pressure or comfortable enough for an attacking lob?"
    ]
   ],
   "drills": {
    "technique": "Cross-court and straight lobs from the baseline to a target above the net player's reach, aiming for depth first.",
    "decision": "Partner stands at the net; you choose lob or drive on each fed ball and say why out loud, then check where it landed.",
    "match": "Count your lobs in a set and notice which ones bought you time to recover.",
    "basis": "proposed and unverified (our own adaptation, not coach-reviewed)"
   }
  },
  {
   "id": "back_glass",
   "name": "Back-glass return (salida de pared)",
   "category": "defensive",
   "strength": "strong",
   "keywords": [
    "back wall",
    "back glass",
    "salida de pared",
    "off the back",
    "rebound",
    "glass behind",
    "back-wall"
   ],
   "facts": [
    "Anticipate where the ball goes after the rebound, create space and prepare early.",
    "Players get cramped by moving into the ball too early, or by not letting the rebound happen.",
    "The path of the ball decides the contact position."
   ],
   "mistakes": [
    "Standing too close to the glass",
    "Hitting before the rebound",
    "Getting caught underneath the ball"
   ],
   "ask": [
    "Where are you standing when it reaches the glass?",
    "Is the ball coming into your body, or moving away from you?",
    "Do you have room to swing or are you cramped?"
   ],
   "avoid": [
    "Do NOT give one fixed rule such as \"stand further forward\", \"move sideways\" or \"wait longer\". Say WHEN: before the opponent hits, as the ball approaches, after the rebound, at contact.",
    "Until the rebound path is clear, do not prescribe exact spacing, turning or movement changes. Offer a thing to notice (where does the ball finish? do you see it early?) and keep any movement idea as a possibility."
   ],
   "sources": [
    "The Padel School",
    "Hello Padel"
   ],
   "causes": [
    [
     "Ball gets too close after the glass",
     "moving toward the contact point instead of the rebound path, poor spacing, late preparation",
     "Does the ball rebound straight or at an angle?"
    ],
    [
     "Back-glass return sits up",
     "late preparation, contact behind the body, or an attacking shot from a defensive situation",
     "Are you trying to attack from a defensive spot?"
    ]
   ],
   "depends": [
    "Teaching has several components that are not opposites: 'move back with the ball', 'move sideways to make room', 'prepare early'. Which applies depends on the ball's path.",
    "Ball height (a teaching zone, not a scientific threshold): low (ankle to knee) usually needs a controlled recovery shot; mid (waist to chest) gives control with options; high (above shoulder) may allow a more aggressive shot if balanced.",
    "Never say always move back, always move sideways, always wait longer or always attack the rebound. Say what to read (the rebound path), then what to do."
   ],
   "practice": [
    "Corner feeds: anticipate where the rebound ends up instead of chasing where it hits the wall."
   ]
  },
  {
   "id": "side_glass",
   "name": "Side-glass return (salida de lateral)",
   "category": "defensive",
   "strength": "strong",
   "keywords": [
    "side wall",
    "side glass",
    "salida de lateral",
    "lateral"
   ],
   "facts": [
    "Read the angle after the ball hits the side glass.",
    "Common difficulty: trust to wait for the rebound.",
    "Depending on angle and depth it can be better to wait for a second wall."
   ],
   "mistakes": [
    "Reacting too early",
    "Swinging at the first bounce"
   ],
   "ask": [
    "Does the ball surprise you, or do you see it coming and still get cramped?"
   ],
   "avoid": [
    "No single movement rule.",
    "Until the rebound path is clear, do not prescribe exact spacing, turning or movement changes. Offer a thing to notice (where does the ball finish? do you see it early?) and keep any movement idea as a possibility."
   ],
   "sources": [
    "The Padel School"
   ],
   "drills": {
    "technique": "Feeds that clip the side glass; repeat until you can read where it will come off.",
    "decision": "Partner alternates feeds that bounce into the glass and ones that skip off it; call which before you move.",
    "match": "Watch how the ball comes off the side glass in the first few games, and write down one thing you noticed.",
    "basis": "proposed and unverified (our own adaptation, not coach-reviewed)"
   }
  },
  {
   "id": "double_glass",
   "name": "Double glass (doble pared)",
   "category": "defensive",
   "strength": "strong",
   "keywords": [
    "double wall",
    "double glass",
    "doble pared",
    "corner",
    "two walls"
   ],
   "facts": [
    "Tell back-then-side from side-then-back rebounds apart.",
    "Early reading, spacing and position are central.",
    "A full turn is not always needed; it depends on the order and direction of the rebounds."
   ],
   "mistakes": [
    "Turning too early",
    "Misreading the order of the walls"
   ],
   "ask": [
    "Which walls does the ball hit before you get it?"
   ],
   "avoid": [
    "No single rule such as \"always turn\".",
    "Until the rebound path is clear, do not prescribe exact spacing, turning or movement changes. Offer a thing to notice (where does the ball finish? do you see it early?) and keep any movement idea as a possibility."
   ],
   "sources": [
    "The Padel School"
   ],
   "causes": [
    [
     "Double-glass return is mistimed",
     "misreading the order of the rebounds, turning wrongly, or not enough space",
     "Back-then-side or side-then-back? They need different anticipation."
    ]
   ],
   "practice": [
    "Corner feeds, watching where the rebound finishes rather than where it touches the wall."
   ]
  },
  {
   "id": "contrapared",
   "name": "Back-wall rescue (contrapared)",
   "category": "defensive",
   "strength": "moderate",
   "keywords": [
    "contrapared",
    "own glass",
    "rescue",
    "behind you"
   ],
   "facts": [
    "An emergency shot using your own back glass to send the ball over the net.",
    "Needs the right height and control. Hitting your own fence is different.",
    "A recovery option, not a preferred attacking one."
   ],
   "mistakes": [
    "Relying on it as a first choice"
   ],
   "ask": [
    "Is this a regular shot for you or a last resort?"
   ],
   "avoid": [
    "Do not recommend it as a goal."
   ],
   "sources": [
    "Padel Relay"
   ],
   "drills": {
    "technique": "Feed to the side glass then back glass; practise letting the ball come off and meeting it with a smooth, compact swing.",
    "decision": "Partner varies the feeds so some give you time and some do not; call 'let it come' or 'play it now' before the bounce.",
    "match": "Focus on one decision per game: let it come off the glass, or take it early.",
    "basis": "proposed and unverified (our own adaptation, not coach-reviewed)"
   }
  },
  {
   "id": "defend_smash",
   "name": "Defending a smash (defensa del remate)",
   "category": "defensive",
   "strength": "strong",
   "keywords": [
    "defend a smash",
    "defending a smash",
    "smashed at me",
    "smash against me",
    "defensa del remate",
    "opponent smash"
   ],
   "facts": [
    "Recognise the likely rebound before committing to an interception.",
    "Some powerful smashes are best handled by letting the ball rebound instead of blocking at once.",
    "What you do depends on the direction of the smash and the speed of the rebound."
   ],
   "mistakes": [
    "Reacting too early",
    "Blocking with the arm instead of moving"
   ],
   "ask": [
    "Does the smash come off the glass or straight at you?"
   ],
   "avoid": [
    "No single answer such as \"always let it bounce\"."
   ],
   "sources": [
    "The Padel School"
   ],
   "drills": {
    "technique": "Partner smashes at moderate pace; practise letting the ball bounce and playing it back high and deep.",
    "decision": "Partner mixes flat and bouncing smashes; call 'take it out of the air' or 'let it bounce' before the shot.",
    "match": "When you are lobbed or smashed at, give yourself one calm breath before choosing.",
    "basis": "proposed and unverified (our own adaptation, not coach-reviewed)"
   }
  },
  {
   "id": "fence_rebound",
   "name": "Fence rebound (rebote de reja)",
   "category": "defensive",
   "strength": "limited",
   "keywords": [
    "fence",
    "mesh",
    "reja",
    "metal"
   ],
   "facts": [
    "Metal mesh gives less predictable rebounds than glass.",
    "Notice what surface it is and expect uneven bounces.",
    "Specific movement advice is not well documented yet."
   ],
   "mistakes": [
    "Treating it like glass"
   ],
   "ask": [
    "Does this happen on a particular court?"
   ],
   "avoid": [
    "Do not prescribe a technique."
   ],
   "sources": [
    "FIP"
   ],
   "drills": {
    "technique": "Partner feeds balls that bounce then hit the back glass; you let each one come off the glass and play it back to a target, calling 'glass' out loud.",
    "decision": "Partner feeds a mix of deep balls and shorter ones; before each bounce you call 'glass' (let it come off the back wall) or 'block' (play it now). No points, calling is the whole job.",
    "match": "In a set, pick two rallies a game where you consciously call it in your head, and notice afterwards how often you were right.",
    "basis": "proposed and unverified (our own adaptation, not coach-reviewed)"
   }
  },
  {
   "id": "chiquita",
   "name": "Chiquita",
   "category": "transition",
   "strength": "strong",
   "keywords": [
    "chiquita",
    "feet",
    "low ball to feet"
   ],
   "facts": [
    "A soft, low ball aimed at the net players, often at their feet, to force an awkward volley and gain time to advance.",
    "Too much pace reduces the time to move forward.",
    "Whether to advance depends on how good the shot is and how the opponent replies."
   ],
   "mistakes": [
    "Hitting it with too much pace",
    "Moving forward before seeing the reply"
   ],
   "ask": [
    "What do they do with it: attack it, or give you time?"
   ],
   "avoid": [
    "Do not say always follow it in.",
    "Playing a chiquita does not mean advancing. Say to judge the reply first: advance only if it left them an awkward ball, otherwise recover."
   ],
   "sources": [
    "The Padel School"
   ],
   "causes": [
    [
     "Chiquita gets attacked",
     "too fast, too high, poor choice, or opponents already set to volley",
     "Did it force a hard volley or give an easy one?"
    ]
   ],
   "depends": [
    "Advance after a good chiquita or lob; recover if it left an easy attack."
   ],
   "practice": [
    "Slow shots to the net player's feet, noticing whether you have time to advance."
   ]
  },
  {
   "id": "attack_lob",
   "name": "Attacking lob (globo de ataque)",
   "category": "transition",
   "strength": "strong",
   "keywords": [
    "attacking lob",
    "globo de ataque",
    "lob over them"
   ],
   "facts": [
    "Used when you have the control to exploit the space behind the net pair.",
    "Flatter and more penetrating than a high defensive lob, to push opponents back and let you take the net."
   ],
   "mistakes": [
    "Hitting it short",
    "Using it without space behind them"
   ],
   "ask": [
    "Is the space behind them open?"
   ],
   "avoid": [
    "Do not mix it up with the defensive lob.",
    "A good lob does not mean automatically moving up; judge the reply first."
   ],
   "sources": [
    "The Padel School"
   ]
  },
  {
   "id": "passing",
   "name": "Passing shot (passing)",
   "category": "transition",
   "strength": "moderate",
   "keywords": [
    "passing shot",
    "passing",
    "pass them"
   ],
   "facts": [
    "Tries to beat players at the net with placement and trajectory.",
    "High risk if both cover well; a ball to the feet or a lob is often more reliable.",
    "Better when opponents are pulled out of position."
   ],
   "mistakes": [
    "Trying it when they are set"
   ],
   "ask": [
    "Where are they standing when you try it?"
   ],
   "avoid": [
    "Do not recommend it as a default."
   ],
   "sources": [
    "Padelguru"
   ]
  },
  {
   "id": "half_volley",
   "name": "Half volley (media volea)",
   "category": "transition",
   "strength": "strong",
   "keywords": [
    "half volley",
    "media volea",
    "bounce volley",
    "at my feet"
   ],
   "facts": [
    "Played soon after the bounce, often when you cannot move back or forward enough for an easier shot.",
    "Low centre of gravity, a stable base, a compact swing and controlled contact."
   ],
   "mistakes": [
    "Standing tall",
    "Big swing"
   ],
   "ask": [
    "Where are you when the ball arrives at your feet?"
   ],
   "avoid": [
    "Do not prescribe more than these basics."
   ],
   "sources": [
    "The Padel School"
   ]
  },
  {
   "id": "between_legs",
   "name": "Between the legs (entre piernas)",
   "category": "specialist",
   "strength": "limited",
   "keywords": [
    "between the legs",
    "entre piernas",
    "tweener"
   ],
   "facts": [
    "An improvised recovery when the ball travels behind you and normal positioning is not possible.",
    "Carries timing, balance and safety risks. Not a foundation skill."
   ],
   "mistakes": [
    "Trying it for show in a match"
   ],
   "ask": [
    "Is this a goal or just a fun shot?"
   ],
   "avoid": [
    "Evidence is thin: no technique advice. Treat it as fun."
   ],
   "sources": [
    "Limited sources"
   ]
  },
  {
   "id": "behind_back",
   "name": "Behind the back (por detrás de la espalda)",
   "category": "specialist",
   "strength": "limited",
   "keywords": [
    "behind the back",
    "por detrás",
    "por detras",
    "behind my back"
   ],
   "facts": [
    "An improvised shot when normal preparation is blocked. Situational, not foundational."
   ],
   "mistakes": [
    "Using it when a simple shot is available"
   ],
   "ask": [
    "Is this a goal or just a fun shot?"
   ],
   "avoid": [
    "Evidence is thin: no technique advice. Treat it as fun."
   ],
   "sources": [
    "Limited sources"
   ]
  },
  {
   "id": "out_of_court",
   "name": "Playing outside the court (salida de pista)",
   "category": "specialist",
   "strength": "strong",
   "keywords": [
    "outside the court",
    "out of the court",
    "salida de pista",
    "leave the court",
    "go round"
   ],
   "facts": [
    "Under authorised conditions players may leave the court to play legal balls.",
    "FIP rules cover access and safety; whether it is allowed depends on the venue and the match."
   ],
   "mistakes": [
    "Assuming it is allowed everywhere"
   ],
   "ask": [
    "What court and rules are you playing under?"
   ],
   "avoid": [
    "Say that clubs differ. Do not give technique advice."
   ],
   "sources": [
    "FIP rules"
   ]
  },
  {
   "id": "court_position",
   "name": "Knowing where to stand (posición en pista)",
   "category": "movement",
   "strength": "strong",
   "keywords": [
    "where to stand",
    "position",
    "positioning",
    "court position",
    "stand"
   ],
   "facts": [
    "Position changes with where the ball is, where the opponents are, and whether the pair is attacking or defending.",
    "Starting positions are reference points, not fixed spots.",
    "Avoid being stuck in the in-between area without a reason."
   ],
   "mistakes": [
    "Standing in no-man's land",
    "Staying fixed in one spot"
   ],
   "ask": [
    "When do you notice you are in the wrong place: after a lob, after a wide ball, or in a rally?"
   ],
   "avoid": [
    "No fixed rule such as \"always stand X metres from the glass\"."
   ],
   "sources": [
    "The Padel School"
   ]
  },
  {
   "id": "split_step",
   "name": "Ready position and split step",
   "category": "movement",
   "strength": "strong",
   "keywords": [
    "split step",
    "ready position",
    "late to the ball",
    "late",
    "off balance",
    "footwork",
    "first step"
   ],
   "facts": [
    "A stable stance with the racket ready.",
    "Time the split step so you are balanced when the opponent hits, not still running forward.",
    "This helps first-step speed and balance."
   ],
   "mistakes": [
    "Still running when the opponent hits",
    "Flat feet",
    "Running straight at the ball"
   ],
   "ask": [
    "Are you late on balls out wide, or all balls?",
    "Are you moving when the opponent hits?"
   ],
   "avoid": [
    "Do not give a list of drills."
   ],
   "sources": [
    "The Padel School"
   ],
   "drills": {
    "technique": "Do small hops with a partner feeding, landing as the opponent hits.",
    "decision": "Partner points left or right as they hit; you split-step then move to that side.",
    "match": "Remind yourself to split-step at the start of each point, only on your own serve points.",
    "basis": "proposed and unverified (our own adaptation, not coach-reviewed)"
   }
  },
  {
   "id": "take_net",
   "name": "Taking and holding the net (subir y mantener la red)",
   "category": "movement",
   "strength": "strong",
   "keywords": [
    "take the net",
    "taking the net",
    "hold the net",
    "lose the net",
    "coming to the net",
    "net position",
    "moving up"
   ],
   "facts": [
    "The net is a strong position but you move up after a suitable shot and together with your partner.",
    "Lobs and chiquitas can give time to advance. A bandeja helps keep the net when opponents lob."
   ],
   "mistakes": [
    "Moving up after a poor shot",
    "Moving up alone"
   ],
   "ask": [
    "Which shot are you playing before you try to move up?"
   ],
   "avoid": [
    "No rule such as \"always follow your shot in\".",
    "Never tell them to advance automatically after a lob or chiquita. Say to judge the shot and the reply, and move together with the partner when there is time."
   ],
   "sources": [
    "The Padel School"
   ],
   "causes": [
    [
     "Loses the net after a lob",
     "late overhead decision, a weak overhead, poor recovery, or the partner not moving with them",
     "Is the problem the overhead itself or what happens after it?"
    ]
   ],
   "depends": [
    "Don't move up just because you played a lob or chiquita; the quality of that ball decides if you have time and pressure.",
    "Research on professionals links finishing at the net with winning more rallies, but that does not mean a recreational player should rush forward after every shot."
   ]
  },
  {
   "id": "recovery",
   "name": "Recovery (recuperación)",
   "category": "movement",
   "strength": "strong",
   "keywords": [
    "recovery",
    "recover",
    "get back",
    "after the shot",
    "after hitting"
   ],
   "facts": [
    "After a shot, go to a position that fits the next likely reply.",
    "The best spot changes with shot direction, the opponents and where your partner is.",
    "Especially important after overheads and wide volleys."
   ],
   "mistakes": [
    "Admiring the shot",
    "Recovering to a fixed spot"
   ],
   "ask": [
    "After which shot are you out of position?"
   ],
   "avoid": [
    "No single \"home\" spot."
   ],
   "sources": [
    "The Padel School"
   ]
  },
  {
   "id": "pair_movement",
   "name": "Moving as a pair (moverse en pareja)",
   "category": "movement",
   "strength": "strong",
   "keywords": [
    "move together",
    "moving together",
    "as a pair",
    "gap in the middle",
    "gap",
    "partner position",
    "pair"
   ],
   "facts": [
    "Partners generally move up, back and sideways together to avoid gaps.",
    "If one player is pulled wide, the other usually shifts toward the middle to cover.",
    "These are foundations with exceptions."
   ],
   "mistakes": [
    "Moving independently",
    "Both holding position"
   ],
   "ask": [
    "When does the gap open: after a wide ball, after a lob, or in a rally?"
   ],
   "avoid": [
    "Do not make up rules like \"the first to move takes the ball\".",
    "The research does not support giving every middle ball to whoever moves first.",
    "Don't say 'always move back together'. Sometimes one player covers the lob while the partner holds a good position; say to communicate early and adjust together according to the lob and the shot you can play."
   ],
   "sources": [
    "The Padel School"
   ],
   "depends": [
    "If one player is pulled wide, the partner often covers the middle; if one retreats, the pair usually adjusts together."
   ]
  },
  {
   "id": "shot_choice",
   "name": "Shot choice (elección del golpe)",
   "category": "tactics",
   "strength": "strong",
   "keywords": [
    "shot choice",
    "what shot",
    "which shot",
    "decision",
    "when to attack",
    "when to defend"
   ],
   "facts": [
    "The choice depends on ball quality, your position, where the opponents are, your aim and the risk.",
    "Slowing the rally down can be a good choice.",
    "Overhead choice depends especially on the depth and path of the lob."
   ],
   "mistakes": [
    "Attacking every ball",
    "Choosing the same shot out of habit"
   ],
   "ask": [
    "What were you trying to do with the point when it went wrong?"
   ],
   "avoid": [
    "No rule without saying when it does NOT apply."
   ],
   "sources": [
    "The Padel School"
   ],
   "depends": [
    "Winning pairs in a study of sub-elite matches made fewer volley errors, and most points came from unforced errors, so consistency is a real tactical goal. It does not mean never attacking."
   ],
   "practice": [
    "Tactical restraint: set a match focus such as controlling pace, avoiding premature smashes, or recovering position."
   ]
  },
  {
   "id": "communication",
   "name": "Talking to your partner (comunicación)",
   "category": "tactics",
   "strength": "strong",
   "keywords": [
    "talk",
    "call",
    "calling",
    "communication",
    "partner shouts",
    "annoyed",
    "mine",
    "yours"
   ],
   "facts": [
    "Early, short information about the opponents helps shot choice.",
    "Talk before and between points too. A late call is useless.",
    "Agreed words help partners understand each other."
   ],
   "mistakes": [
    "Calling late",
    "Not agreeing words",
    "Blaming"
   ],
   "ask": [
    "When do you talk now: before points, between points, or not much?",
    "What happens when you do not agree?"
   ],
   "avoid": [
    "Do not take sides in a partner disagreement.",
    "Frame calls as 'communicate early and adjust together', not as fixed commands for every ball."
   ],
   "sources": [
    "The Padel School"
   ]
  },
  {
   "id": "build_point",
   "name": "Building points (construir el punto)",
   "category": "tactics",
   "strength": "strong",
   "keywords": [
    "build the point",
    "construct",
    "setting up",
    "patient",
    "too aggressive",
    "winner"
   ],
   "facts": [
    "Controlled shots can force weaker replies and create later chances.",
    "A setup volley can be better than a rushed winner.",
    "Changes in pace, height and direction disturb the opponents' rhythm."
   ],
   "mistakes": [
    "Going for the winner too early"
   ],
   "ask": [
    "What was the shot before the one that went wrong?"
   ],
   "avoid": [
    "No \"be more patient\" without a concrete idea."
   ],
   "sources": [
    "The Padel School"
   ],
   "practice": [
    "Same error, different ball: feed varied heights and speeds and note where the mistake appears.",
    "Technique under increasing difficulty: comfortable feeds, then movement, then faster balls, then points."
   ]
  },
  {
   "id": "middle_ball",
   "name": "The middle ball (responsabilidad del centro)",
   "category": "tactics",
   "strength": "strong",
   "keywords": [
    "middle",
    "middle ball",
    "centre",
    "center",
    "who takes"
   ],
   "facts": [
    "Needs coordinated positioning, communication and judgement.",
    "A \"forehand in the middle\" convention can help some pairs but is not universal.",
    "Reach, ball direction and each player's position decide who should take it."
   ],
   "mistakes": [
    "Both going",
    "Neither going",
    "Late call"
   ],
   "ask": [
    "What happens on the ball you both miss: where are you each standing?"
   ],
   "avoid": [
    "Do not say that the first to move or the forehand always takes it. At most offer a simple starting idea and say when it does not apply.",
    "The research does not support 'first to move takes it'."
   ],
   "sources": [
    "The Padel School"
   ],
   "drills": {
    "technique": "Rally with a partner, hitting down the middle and practising who takes it.",
    "decision": "Partner feeds balls through the middle; agree a call ('mine', 'yours') before the bounce.",
    "match": "Agree a middle-ball call with your partner before the match and notice how it goes.",
    "basis": "proposed and unverified (our own adaptation, not coach-reviewed)"
   }
  },
  {
   "id": "rules",
   "name": "Rules and scoring (reglas y tanteo)",
   "category": "tactics",
   "strength": "strong",
   "keywords": [
    "rules",
    "scoring",
    "score",
    "golden point",
    "fault",
    "let",
    "tie break",
    "tiebreak"
   ],
   "facts": [
    "FIP rules cover the serve, the order of serving and returning, faults, lets, scoring, ball in play, wall rebounds and authorised play outside the court.",
    "Local competitions may use other scoring formats, such as golden point."
   ],
   "mistakes": [],
   "ask": [],
   "avoid": [
    "Say that clubs differ."
   ],
   "sources": [
    "FIP rules"
   ]
  },
  {
   "id": "composure",
   "name": "Composure (calma bajo presión)",
   "category": "mentality",
   "strength": "moderate",
   "keywords": [
    "nervous",
    "nerves",
    "pressure",
    "big points",
    "tight",
    "choke",
    "freeze",
    "anxious",
    "30-40"
   ],
   "facts": [
    "Competitive anxiety can affect decisions and execution.",
    "Research on high-level men links anxiety to results; it should not be assumed for every recreational player.",
    "Strategies need to fit the person."
   ],
   "mistakes": [
    "Rushing",
    "Trying not to miss",
    "Changing the swing"
   ],
   "ask": [
    "What do you notice in your body or your decisions on big points?"
   ],
   "avoid": [
    "Do not promise that a breath or a cue fixes it. Routines go BEFORE or BETWEEN points, not mid-rally.",
    "Don't say a missed shot on a big point was caused by nerves unless the player says they felt it.",
    "Never conclude anxiety from a scoreline alone; ask what they noticed."
   ],
   "sources": [
    "Peer-reviewed study (PMC)"
   ],
   "depends": [
    "A 2026 study of high-level men found no overall difference in several final-shot measures between normal and important points. A miss at break point is not proof of nerves."
   ],
   "drills": {
    "technique": "None needed; this is about habits under pressure.",
    "decision": "Play practice games with artificial pressure (e.g. start at 30-40) and notice what changes.",
    "match": "Pick one thing to do on big points, like the same routine every time, and notice if it helped.",
    "basis": "proposed and unverified (our own adaptation, not coach-reviewed)"
   }
  },
  {
   "id": "bounce_back",
   "name": "Bouncing back (recuperarse del error)",
   "category": "mentality",
   "strength": "moderate",
   "keywords": [
    "mistake",
    "after an error",
    "bounce back",
    "get angry",
    "frustrated",
    "spiral",
    "negative"
   ],
   "facts": [
    "Negative self-talk and high expectations can feed a spiral.",
    "Coaching advice: adjust expectations, rely on reliable shots, reset between points and talk helpfully with the partner."
   ],
   "mistakes": [
    "Dwelling on the last point"
   ],
   "ask": [
    "What do you say to yourself after a mistake?"
   ],
   "avoid": [
    "Do not diagnose a personality."
   ],
   "sources": [
    "Coaching resources"
   ],
   "drills": {
    "technique": "None needed; this is about habits after a lost point.",
    "decision": "Practise a reset routine between points in a practice game: one breath, one cue, next point.",
    "match": "Pick a reset cue for the match and notice whether you used it after the next lost point.",
    "basis": "proposed and unverified (our own adaptation, not coach-reviewed)"
   }
  },
  {
   "id": "focus",
   "name": "Focus (concentración)",
   "category": "mentality",
   "strength": "strong",
   "keywords": [
    "focus",
    "concentration",
    "tired",
    "fatigue",
    "legs went",
    "late in the match",
    "third set"
   ],
   "facts": [
    "Mental fatigue lowered accuracy across several padel strokes in one study of young elite men.",
    "External cues (the target, the ball) usually help motor learning more than thinking about body movements, especially for less skilled players.",
    "This does not prove fatigue is the cause of a given player's misses."
   ],
   "mistakes": [
    "Thinking about body mechanics mid-point"
   ],
   "ask": [
    "When in the match does it fade: early, late, or after long points?"
   ],
   "avoid": [
    "Say \"might\" about fatigue. Prefer cues about the target or the ball.",
    "Fatigue research was in young elite men: say 'might', not 'is'."
   ],
   "sources": [
    "Peer-reviewed studies (PMC)"
   ],
   "drills": {
    "technique": "None needed; this is about attention.",
    "decision": "In a practice game, name one cue per point and check in at the end of each game.",
    "match": "Pick one cue for the match and note after a few games if you kept it.",
    "basis": "proposed and unverified (our own adaptation, not coach-reviewed)"
   }
  }
 ]
};

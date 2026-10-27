import React, { useEffect, useState } from 'react';
import Splash from './screens/Splash.jsx';
import Home from './screens/Home.jsx';
import Onboarding from './screens/Onboarding.jsx';
import Welcome from './screens/Welcome.jsx';
import Skills from './screens/Skills.jsx';
import Goals from './screens/Goals.jsx';
import Matches from './screens/Matches.jsx';
import Coach from './screens/Coach.jsx';
import CheckIn from './screens/CheckIn.jsx';
import Settings from './screens/Settings.jsx';
import TabBar from './components/TabBar.jsx';
import TopBar from './components/TopBar.jsx';
import CoachButton from './components/CoachButton.jsx';
import { pickTheme, applyTheme } from './theme.js';
import { loadPlayer, savePlayer, clearPlayer, migratePlayer } from './store.js';
import { player as samplePlayer } from './data.js';
import { shiftAreas } from './levels.js';
import { modeOf, starterPlayer, levelKnown, levelShown } from './modes.js';

// Testing helpers: ?reset starts again, ?demo shows the sample player (Alex).
const params = new URLSearchParams(location.search);
if (params.has('reset')) clearPlayer();
// Tidy the address, so reloading the page doesn't wipe your data again.
if (params.has('reset') || params.has('demo')) {
  try { history.replaceState(null, '', location.pathname + (params.get('theme') ? `?theme=${params.get('theme')}` : '')); } catch { /* ignore */ }
}
const MAIN = ['home', 'skills', 'goals', 'matches', 'coach', 'checkin', 'settings'];
const savedScreen = () => { try { const s = sessionStorage.getItem('padeliq-screen'); return MAIN.includes(s) ? s : 'home'; } catch { return 'home'; } };

const titles = { home: null, skills: 'Skills', goals: 'Goals', matches: 'Games', coach: 'Coach', checkin: 'Check-in', settings: 'Settings' };

export default function App() {
  const [screen, setScreenRaw] = useState('splash');
  const setScreen = (id) => {
    setScreenRaw(id);
    try { if (MAIN.includes(id)) sessionStorage.setItem('padeliq-screen', id); } catch { /* ignore */ }
    window.scrollTo(0, 0);
  };
  const [coachQuestion, setCoachQuestion] = useState(null);
  const [tapCount, setTapCount] = useState(0); // tapping a tab again goes back to its start
  const [intent, setIntent] = useState(null); // e.g. open a session's plan, or Skills on 'Work on next'
  const go = (id, opts = null) => { setIntent({ ...(opts || {}), fresh: true }); setTapCount((n) => n + 1); setScreen(id); };
  const [player, setPlayer] = useState(() => (params.has('demo') ? migratePlayer(samplePlayer) : loadPlayer()));

  useEffect(() => {
    applyTheme(pickTheme());
  }, []);

  const isDemo = params.has('demo');
  const updatePlayer = (fn) => {
    setPlayer((prev) => {
      const next = fn(prev);
      if (!isDemo) savePlayer(next);
      return next;
    });
  };

  const [redoing, setRedoing] = useState(false);
  const [startName, setStartName] = useState('');
  const mode = modeOf(player);
  const pickMode = (m, name) => {
    if (m === 'full') { setStartName(name); setScreen('onboarding'); return; }
    const p = starterPlayer(name, m);
    savePlayer(p);
    setPlayer(p);
    setScreen(m === 'fun' ? 'matches' : 'home');
  };
  // Just for fun is a games list and nothing else: Home, Skills, Goals and Coach all lead there.
  const view = mode === 'fun' && ['home', 'skills', 'goals', 'coach', 'checkin'].includes(screen) ? 'matches' : screen;
  const finishOnboarding = (result) => {
    setRedoing(false);
    const old = player && !isDemo ? player : {};
    const p = {
      ...old,
      name: result.name || old.name || 'Player',
      mode: 'full',
      provisional: true,
      level: result.level,
      levelSetByPlayer: !!result.setByPlayer,
      axisLevels: result.axisLevels, // already moved to match a level you picked
      about: result.about,
      extra: result.extra,
      answers: result.answers,
      quizChecks: result.quizChecks || {},
      quiz: result.quiz,
      goals: old.goals || [],
      sessions: old.sessions || [],
      skillChecks: old.skillChecks || {},
      nextSession: null,
      insight: null,
      createdAt: old.createdAt || new Date().toISOString(),
    };
    savePlayer(p);
    setPlayer(p);
    setScreen('home');
  };

  return (
    <div className="app">
      {screen === 'splash' && <Splash onDone={() => setScreen(player ? savedScreen() : 'welcome')} />}
      {screen === 'welcome' && <Welcome onPick={pickMode} />}
      {screen === 'onboarding' && <Onboarding initialName={startName} onDone={finishOnboarding} onCancel={redoing ? () => { setRedoing(false); setScreen('settings'); } : null} />}
      {['home', 'skills', 'goals', 'matches', 'coach', 'checkin', 'settings'].includes(screen) && player && (
        <>
          <TopBar title={titles[view]} onHome={() => setScreen(mode === 'fun' ? 'matches' : 'home')} onSettings={view === 'home' || (mode === 'fun' && view === 'matches') ? () => setScreen('settings') : null}>
            {mode !== 'fun' && !['coach', 'checkin', 'settings'].includes(view) && (
              <CoachButton screen={screen} onOpenCoach={(p) => {
                // "Help with a weak spot" opens a deep dive on your first goal, if you have one.
                const goal = (player.goals || [])[0];
                const start = p.mode === 'deep_dive_goal' ? (goal ? { mode: 'deep_dive', skillId: goal.skillId } : { mode: 'deep_dive' }) : p.mode ? { mode: p.mode } : null;
                setCoachQuestion(start); setTapCount((n) => n + 1); setScreen('coach');
              }} />
            )}
          </TopBar>
          {view === 'home' && <Home player={player} updatePlayer={updatePlayer} mode={mode} onGo={go} />}
          {view === 'checkin' && <CheckIn player={player} updatePlayer={updatePlayer} onDone={() => setScreen('matches')} />}
          {view === 'settings' && (
            <Settings
              player={player}
              updatePlayer={updatePlayer}
              onBack={() => setScreen(mode === 'fun' ? 'matches' : 'home')}
              onRedoQuiz={() => { setRedoing(true); setScreen('onboarding'); }}
              onReset={() => { clearPlayer(); setPlayer(null); setScreen('welcome'); }}
            />
          )}
          {view === 'skills' && <Skills key={'s' + tapCount} known={levelShown(player)} player={player} updatePlayer={updatePlayer} startView={intent?.view} openSkill={intent?.open} />}
          {view === 'goals' && <Goals simple={!levelKnown(player)} player={player} updatePlayer={updatePlayer} onAdd={() => go('skills', { view: 'next' })} />}
          {view === 'matches' && <Matches key={'m' + tapCount} mode={mode} player={player} updatePlayer={updatePlayer} onCheckIn={() => setScreen('checkin')} openPlan={intent?.plan} openReflect={intent?.reflect} fresh={!!intent?.fresh} />}
          {view === 'coach' && <Coach key={'c' + tapCount} howTo={mode} player={player} updatePlayer={updatePlayer} start={coachQuestion} onGoSkills={() => go('skills', { view: 'explore' })} />}
          {mode !== 'fun' && <TabBar active={view} onChange={(id) => { setCoachQuestion(null); go(id); }} />}
        </>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Splash from './screens/Splash.jsx';
import Home from './screens/Home.jsx';
import Onboarding from './screens/Onboarding.jsx';
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
import { loadPlayer, savePlayer, clearPlayer } from './store.js';
import { player as samplePlayer } from './data.js';

// Testing helpers: ?reset starts again, ?demo shows the sample player (Alex).
const params = new URLSearchParams(location.search);
if (params.has('reset')) clearPlayer();

const titles = { home: null, skills: 'Skills', goals: 'Goals', matches: 'Matches', coach: 'Coach', checkin: 'Check-in', settings: 'Settings' };

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [coachQuestion, setCoachQuestion] = useState(null);
  const [tapCount, setTapCount] = useState(0); // tapping a tab again goes back to its start
  const [player, setPlayer] = useState(() => (params.has('demo') ? samplePlayer : loadPlayer()));

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

  const finishOnboarding = (result) => {
    const old = player && !isDemo ? player : {};
    const p = {
      ...old,
      name: result.name || old.name || 'Player',
      provisional: true,
      level: result.level,
      levelSetByPlayer: result.setByPlayer,
      axisLevels: result.axisLevels,
      about: result.about,
      extra: result.extra,
      answers: result.answers,
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
      {screen === 'splash' && <Splash onDone={() => setScreen(player ? 'home' : 'onboarding')} />}
      {screen === 'onboarding' && <Onboarding onDone={finishOnboarding} />}
      {['home', 'skills', 'goals', 'matches', 'coach', 'checkin', 'settings'].includes(screen) && player && (
        <>
          <TopBar title={titles[screen]} onHome={() => setScreen('home')} onSettings={screen === 'home' ? () => setScreen('settings') : null} />
          {screen === 'home' && <Home player={player} onGo={setScreen} />}
          {screen === 'checkin' && <CheckIn player={player} updatePlayer={updatePlayer} onDone={() => setScreen('matches')} />}
          {screen === 'settings' && (
            <Settings
              player={player}
              updatePlayer={updatePlayer}
              onBack={() => setScreen('home')}
              onRedoQuiz={() => setScreen('onboarding')}
              onReset={() => { clearPlayer(); setPlayer(null); setScreen('onboarding'); }}
            />
          )}
          {screen === 'skills' && <Skills key={'s' + tapCount} player={player} updatePlayer={updatePlayer} />}
          {screen === 'goals' && <Goals player={player} updatePlayer={updatePlayer} />}
          {screen === 'matches' && <Matches key={'m' + tapCount} player={player} updatePlayer={updatePlayer} onCheckIn={() => setScreen('checkin')} />}
          {screen === 'coach' && <Coach question={coachQuestion} />}
          {!['coach', 'checkin', 'settings'].includes(screen) && (
            <CoachButton screen={screen} onOpenCoach={(q) => { setCoachQuestion(q); setScreen('coach'); }} />
          )}
          <TabBar active={screen} onChange={(id) => { setCoachQuestion(null); setTapCount((n) => n + 1); setScreen(id); }} />
        </>
      )}
    </div>
  );
}

# Padel IQ app (first screens)

Built so far: the loading screen and the home screen.

## Quick look (no setup)
Double-click `PadelIQ-preview.html`. It opens in your browser.
Tip in Chrome: press F12, then the little phone icon, to see it phone-sized.

Try the other courts by adding this to the end of the address:
`?theme=clay`   or   `?theme=green`   (blue is the default)

## Work on it in Cursor
1. Install Node.js (the "LTS" version) from nodejs.org, once.
2. Open this `6-app` folder in Cursor.
3. In the terminal, run: `npm install` (first time only)
4. Then run: `npm run dev`
5. It prints two addresses. Open the first on your computer.
   The "Network" one opens on your phone if it is on the same Wi-Fi.
6. When you want a fresh double-click file: run `npm run build`.
   The new file appears at `dist/index.html`.

## Where things live
- `../5-data/themes.json`        colours for the three courts
- `../5-data/framework.json`     axes, levels and skills
- `../5-data/sample-player.json` made-up player used to fill the screens
- `src/screens/`                 Splash.jsx (loading) and Home.jsx
- `src/components/`              Pentagon.jsx and TabBar.jsx
- `src/styles.css`               all the styling

Change a colour or a skill in the data files and the app updates. No screen code needs touching.

## Placeholders (to replace later)
- The logo is a quick cut-out of your original logo. A clean transparent file will replace it.
- The court background is a simple grain, not the real texture yet.
- The player, goals, match and coach insight are made up.
- The tab buttons do nothing yet. Tapping a pentagon area shows its skills.
- The overall level uses a draft rule: where most areas sit.

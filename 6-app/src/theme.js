import { themes, defaultTheme } from './data.js';

// Which court? Order: ?theme=clay in the address, then the saved choice, then the default.
export function pickTheme() {
  const fromUrl = new URLSearchParams(window.location.search).get('theme');
  let saved = null;
  try { saved = window.localStorage.getItem('padeliq-theme'); } catch (e) { /* ignore */ }
  for (const id of [fromUrl, saved, defaultTheme]) {
    if (id && themes[id]) return id;
  }
  return defaultTheme;
}

export function applyTheme(id) {
  const t = themes[id];
  const root = document.documentElement.style;
  root.setProperty('--bg', t.background);
  root.setProperty('--panel', t.panel);
  root.setProperty('--panel-border', t.panelBorder);
  root.setProperty('--text', t.text);
  root.setProperty('--text-soft', t.textSoft);
  root.setProperty('--chalk', t.chalk);
  root.setProperty('--accent', t.accent);
  root.setProperty('--accent-text', t.accentText);
  root.setProperty('--pent-fill', t.pentagonFill);
  root.setProperty('--pent-line', t.pentagonLine);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.background);
  try { window.localStorage.setItem('padeliq-theme', id); } catch (e) { /* ignore */ }
}

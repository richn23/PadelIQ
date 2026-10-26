import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// The build is one single HTML file (dist/index.html) so it can be opened by double-clicking.
// The data files live one folder up, in 5-data, so allow the dev server to read from there.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  server: { fs: { allow: ['..'] } },
  build: { assetsInlineLimit: 100000000 },
});

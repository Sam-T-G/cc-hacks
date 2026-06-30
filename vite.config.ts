import { defineConfig } from 'vite';

// CC Hacks is served from the GitHub Pages project subpath /cc-hacks/.
// If this ever moves to a custom domain or a user-page repo, change base to '/'.
export default defineConfig({
  base: '/cc-hacks/',
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});

import { defineConfig } from 'vite';

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// so asset URLs need the repo name as a base path in production. Local dev
// and `vite preview` stay at the root.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/guitar-games/' : '/',
});

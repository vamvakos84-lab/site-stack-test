import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages serves a project site under /<repository name>/.
export default defineConfig({
  site: 'https://vamvakos84-lab.github.io',
  base: '/site-stack-test',
  integrations: [sitemap()],
});

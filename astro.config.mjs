import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://opengovclimate.ch',
  integrations: [preact()],
  vite: {
    build: {
      // Pagefind is emitted by postbuild and loaded in the browser on demand.
      rolldownOptions: { external: ['/pagefind/pagefind.js'] },
    },
  },
  i18n: {
    locales: ['en', 'de', 'fr', 'it'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

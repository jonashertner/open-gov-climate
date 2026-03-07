import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://opengovclimate.ch',
  integrations: [preact()],
  i18n: {
    locales: ['en', 'de', 'fr', 'it'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
    },
  },
});

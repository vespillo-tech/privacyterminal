import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://privacyterminal.com',
  output: 'static',
  integrations: [tailwind(), sitemap()],
});

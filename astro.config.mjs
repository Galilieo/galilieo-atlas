import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { siteConfig } from './src/config/site.ts';

export default defineConfig({
  site: siteConfig.url,
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [mdx(), sitemap()],
});

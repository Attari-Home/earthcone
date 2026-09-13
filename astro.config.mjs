// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// TODO: replace with the confirmed production domain before launch.
// GH_PAGES is set only by .github/workflows/gh-pages.yml, so the Cloudflare
// deploy (deploy.yml) and local dev keep using the real domain and root base.
const isGhPages = process.env.GH_PAGES === 'true';
const SITE_URL = isGhPages ? 'https://attari-home.github.io' : 'https://earthcone.ae';

// https://astro.build/config
export default defineConfig({
    site: SITE_URL,
    base: isGhPages ? '/earthcone' : '/',
    trailingSlash: 'ignore',
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'viewport',
    },
    integrations: [
        icon({
            iconDir: 'src/icons',
        }),
        sitemap(),
        mdx(),
    ],
    image: {
        responsiveStyles: true,
    },
    vite: {
        plugins: [/** @type {any} */ (tailwindcss())],
        resolve: {
            dedupe: ['vite'],
        },
    },
});

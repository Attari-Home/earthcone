// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// TODO: replace with the confirmed production domain before launch.
// GH_PAGES is set only by .github/workflows/gh-pages.yml (the only deploy target
// for now — see CLAUDE.md §10). Local dev keeps using the real domain and root
// base; re-add a Cloudflare Pages deploy workflow once a domain is purchased,
// at which point it should build without GH_PAGES set, same as local dev.
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

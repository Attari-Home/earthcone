// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// Two deploy targets (see CLAUDE.md §10):
//   unset            → production: Cloudflare + the custom domain. Local dev mirrors this.
//   DEPLOY_TARGET=staging → the GitHub Pages staging site, served from a repo subpath, so it
//                           needs its own origin and `base`. Set only by staging-pages.yml.
// The matching PUBLIC_DEPLOY_TARGET (same workflow) is what page code reads to mark the
// staging build noindex — without it, staging would compete with the real site in search.
const isStaging = process.env.DEPLOY_TARGET === 'staging';
const SITE_URL = isStaging ? 'https://attari-home.github.io' : 'https://earthconecontracting.com';

// https://astro.build/config
export default defineConfig({
    site: SITE_URL,
    base: isStaging ? '/earthcone' : '/',
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

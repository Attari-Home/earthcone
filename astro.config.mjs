// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// Production domain, confirmed and purchased via Cloudflare — see CLAUDE.md §10 for
// the deploy setup (Cloudflare, custom domain attached to the Workers/Pages project).
const SITE_URL = 'https://earthconecontracting.com';

// https://astro.build/config
export default defineConfig({
    site: SITE_URL,
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

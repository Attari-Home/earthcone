// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// TODO: replace with the confirmed production domain before launch.
const SITE_URL = 'https://earthcone.ae';

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

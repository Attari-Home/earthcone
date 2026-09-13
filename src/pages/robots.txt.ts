import type { APIRoute } from 'astro';

// A relative `Sitemap:` URL is invalid per the robots.txt spec (and fails Lighthouse's
// robots-txt audit) — it must be absolute. @astrojs/sitemap always writes
// sitemap-index.xml at the output root, so the served URL is `${site}${base}sitemap-index.xml`.
export const GET: APIRoute = ({ site }) => {
    const sitemapUrl = new URL(`${import.meta.env.BASE_URL}sitemap-index.xml`, site);

    const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`;

    return new Response(body, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
};

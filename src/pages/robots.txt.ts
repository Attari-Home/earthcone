import type { APIRoute } from 'astro';

// A relative `Sitemap:` URL is invalid per the robots.txt spec (and fails Lighthouse's
// robots-txt audit) — it must be absolute. @astrojs/sitemap always writes
// sitemap-index.xml at the output root, so the served URL is `${site}${base}sitemap-index.xml`.
export const GET: APIRoute = ({ site }) => {
    const sitemapUrl = new URL(`${import.meta.env.BASE_URL}sitemap-index.xml`, site);

    // The staging site is a public copy of production on a different origin. Let it get
    // crawled and it competes with the real domain for the same queries, so it is fully
    // disallowed here and marked noindex per page in SEO.astro — belt and braces, because
    // robots.txt only stops crawling, not indexing of URLs discovered elsewhere.
    const body =
        import.meta.env.PUBLIC_DEPLOY_TARGET === 'staging'
            ? `User-agent: *\nDisallow: /\n`
            : `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`;

    return new Response(body, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
};

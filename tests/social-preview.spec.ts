import { expect, test } from '@playwright/test';

const services = [
    'construction',
    'interiors',
    'kitchens',
    'korean-marble',
    'electrical',
    'water-systems',
];

// Every shared link used to show the same site-wide picture. Each service page now carries
// its own og:image, so a WhatsApp/Facebook/LinkedIn post about one service shows that service.
test('each service page has its own reachable social preview image', async ({ request }) => {
    const seen = new Set<string>();
    for (const slug of services) {
        const html = await (await request.get(`/services/${slug}/`)).text();
        const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
        expect(og, `${slug} has an og:image`).toBeTruthy();
        expect(og, `${slug} does not use the site-wide default`).not.toMatch(/og-image\.jpg$/);
        expect(og, `${slug} uses an absolute URL`).toMatch(/^https?:\/\//);
        expect(html).toMatch(new RegExp(`<meta name="twitter:image" content="${og}"`));
        seen.add(og!);

        // The URL points at the production origin; fetch the same file from the preview server.
        const image = await request.get(new URL(og!).pathname);
        expect(image.ok(), `${slug} og:image is served`).toBeTruthy();
        expect(image.headers()['content-type']).toContain('image/jpeg');
    }
    expect(seen.size, 'service pages do not share one image').toBe(services.length);
});

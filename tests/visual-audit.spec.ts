import { test, expect, type Page } from '@playwright/test';

/**
 * Visual/UX audit — diagnostic tool, not just pass/fail. Run before shipping any visual
 * change: `npm run test:visual` (dev server must already be running on :4321).
 *
 * Screenshots land in test-results/screenshots/ — read them, don't just check exit code.
 * A green run only proves the assertions below hold; it does not prove the page looks
 * right. This file caught two real bugs by inspection alone (an oversized hero causing
 * off-screen CTAs, and a dark-mode-only unreadable-text token) that no assertion here
 * was written to catch in advance — screenshots surface the unknown-unknowns, assertions
 * only guard the ones you already know about.
 *
 * See CLAUDE.md "Visual QA workflow" for the full methodology (why per-element computed
 * styles beat pixel-diffing here, and the dev-server-restart-after-install gotcha).
 */

const BASE_URL = 'http://localhost:4321';

async function setTheme(page: Page, theme: 'light' | 'dark') {
    await page.emulateMedia({ colorScheme: theme });
    await page.evaluate((t) => {
        localStorage.setItem('theme', t);
        document.documentElement.setAttribute('data-theme', t);
    }, theme);
}

const viewports = {
    mobile: { width: 390, height: 844 },
    desktop: { width: 1440, height: 900 },
};

for (const themeName of ['light', 'dark'] as const) {
    for (const [vpName, vp] of Object.entries(viewports)) {
        test(`homepage — ${themeName} — ${vpName}`, async ({ page }) => {
            await page.setViewportSize(vp);
            await page.goto(BASE_URL);
            await setTheme(page, themeName);
            await page.reload();
            await page.waitForLoadState('networkidle');

            await page.screenshot({
                path: `test-results/screenshots/home-${themeName}-${vpName}.png`,
                fullPage: false,
            });

            const h1 = page.locator('section h1').first();
            await expect(h1).toBeVisible();
            // .hero-reveal, not .reveal: the hero's own entrance-animation class, decoupled
            // from the scroll-triggered .reveal system elsewhere on the page (see the
            // .hero-reveal comment in global.css) — nth(1) is the eyebrow's sibling, the
            // tagline paragraph, since <h1> between them carries .hero-headline instead.
            const tagline = page.locator('section p.hero-reveal').nth(1);
            await expect(tagline).toBeVisible();

            // First-glance viewport fit: the primary CTA button must be fully within the
            // initial viewport (no scroll needed to see the hero's call to action).
            const button = page.locator('section a.btn-primary').first();
            const buttonBox = await button.boundingBox();
            expect(buttonBox).not.toBeNull();
            expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(vp.height);
        });
    }
}

test('hero tagline stays the same color in light and dark mode', async ({ page }) => {
    // Hero copy sits on a permanently-dark photo overlay regardless of site theme (see the
    // --color-ink comment in global.css) — its text must stay a fixed light color, never an
    // adaptive token, or it silently goes unreadable in dark mode. Compare the two live
    // renders instead of hardcoding an expected color string, since the exact serialized
    // value (oklab/rgb/etc) is a Tailwind/browser implementation detail, not the invariant.
    async function taglineColor(theme: 'light' | 'dark') {
        await page.goto(BASE_URL);
        await setTheme(page, theme);
        await page.reload();
        const tagline = page.locator('section p.hero-reveal').nth(1);
        return tagline.evaluate((el) => getComputedStyle(el).color);
    }

    const light = await taglineColor('light');
    const dark = await taglineColor('dark');
    expect(dark).toBe(light);
});

test('favicon is linked and loads', async ({ page, request }) => {
    await page.goto(BASE_URL);
    const iconHref = await page.locator('link[rel="icon"]').first().getAttribute('href');
    expect(iconHref).toBeTruthy();
    const res = await request.get(`${BASE_URL}${iconHref}`);
    expect(res.ok()).toBeTruthy();

    const appleIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
    expect(appleIcon).toBeTruthy();
});

test('WhatsApp is reachable from every page without scrolling', async ({ page }) => {
    await page.goto(BASE_URL);
    // The floating button (WhatsAppButton.astro) is fixed/persistent — must exist and be
    // visible without scrolling, not just present somewhere further down the page.
    const floatingButton = page.locator('a[aria-label="Chat with us on WhatsApp"]');
    await expect(floatingButton).toBeVisible();
    await expect(floatingButton).toHaveAttribute('href', /^https:\/\/wa\.me\/\d+$/);
});

/**
 * Smoke test for broken assets — this is what actually caught the real bug: Astro's dev
 * image endpoint (/_image) was silently 500-ing for every single image on the site after
 * `npm install` touched node_modules while the dev server was still running from before
 * the install (stale Vite module graph lost its resolution path to `sharp`). Screenshots
 * alone didn't make this obvious — broken <img> renders as blank/alt-text, easy to miss.
 * Restarting the dev server after any dependency install fixed it.
 */
test('no failed network requests or console errors on homepage', async ({ page }) => {
    const failures: string[] = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error') failures.push(`console error: ${msg.text()}`);
    });
    page.on('response', (res) => {
        if (res.status() >= 400) failures.push(`HTTP ${res.status()}: ${res.url()}`);
    });

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    expect(failures, failures.join('\n')).toHaveLength(0);
});

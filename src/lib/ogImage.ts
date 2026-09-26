import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
// Below this a scraper shows a small thumbnail instead of a large preview card, so the
// page is better off with the site-wide default image.
const MIN_WIDTH = 600;

/**
 * Crops a page's own photo towards the 1200x630 social-preview ratio at build time and
 * returns its absolute URL. Link-preview scrapers (WhatsApp, Facebook,
 * LinkedIn, X) need an absolute URL, and a per-page image is what stops every shared link
 * showing the same picture. Sources are never enlarged, so a small photo keeps its own
 * size (og:image:width/height are therefore left out for these); one narrower than
 * MIN_WIDTH returns undefined and the caller keeps the default image.
 * `getImage` output already carries the configured `base`, so it is not run through withBase.
 */
export async function socialImage(
    src: ImageMetadata,
    site: URL | undefined,
): Promise<string | undefined> {
    if (src.width < MIN_WIDTH) return undefined;
    const image = await getImage({
        src,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        fit: 'cover',
        format: 'jpeg',
        quality: 80,
    });
    return new URL(image.src, site).href;
}

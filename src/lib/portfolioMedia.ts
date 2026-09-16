import type { ImageMetadata } from 'astro';
import { withBase } from './url';

// Single static glob calls — Vite requires these patterns to be literal strings
// so it can statically analyze and bundle the matched assets.
const photoModules = import.meta.glob<{ default: ImageMetadata }>('/src/images/*/*.jpeg', {
    eager: true,
});
const posterModules = import.meta.glob<{ default: ImageMetadata }>(
    '/src/images/video-posters/*/*.jpeg',
    { eager: true },
);
const rawVideoPaths = Object.keys(import.meta.glob('/src/images/*/*.mp4', { eager: false }));

// Reference/mood-board images, not photos of completed Earth Cone work — excluded
// from the public portfolio pending client confirmation (see CLAUDE.md/plan notes).
const EXCLUDED_BASENAMES = new Set([
    // Phone-gallery screenshot: the source file includes the photo app's own UI (close
    // button, "Save", "New Stylized Photo" caption) baked into the image. Needs a clean
    // re-export or a crop from the client before it can go in the portfolio.
    'villa-construction-03',
    'interior-design-reference-01',
    'interior-design-reference-02',
    'interior-design-reference-03',
    'interior-design-reference-04',
    'interior-design-reference-05',
    'interior-design-reference-06',
    'office-interior-render-01',
    'office-interior-render-02',
]);

interface ParsedPath {
    folder: string;
    basename: string;
}

function parsePath(path: string): ParsedPath {
    // Folder is always the directory immediately containing the file, regardless of how
    // deep the glob root is (e.g. .../construction-exteriors/x.jpeg vs .../video-posters/construction-exteriors/x.jpeg).
    const parts = path.split('/');
    const folder = parts[parts.length - 2];
    const filename = parts[parts.length - 1];
    const basename = filename.replace(/\.[^.]+$/, '');
    return { folder, basename };
}

// Descriptive alt-text phrase for each known basename root (basename minus its trailing
// sequence number). Keeps alt text specific per CLAUDE.md §5's bar ("not 'kitchen1.jpg' —
// 'custom kitchen cabinetry installation, Dubai villa'") instead of the generic, near-duplicate
// text a plain word-split of the filename would produce across dozens of same-root photos.
const SUBJECT_PHRASES: Record<string, string> = {
    'exterior-paving': 'Exterior paving installation',
    'foundation-construction': 'Building foundation construction',
    'masonry-construction': 'Masonry construction work',
    'outdoor-decking': 'Outdoor decking installation',
    'site-foundation-work': 'Site foundation work in progress',
    'villa-construction': 'Villa construction in progress',
    'villa-facade': 'Villa exterior façade',
    'bathroom-vanity-installation': 'Bathroom vanity installation',
    'bedroom-feature-wall': 'Bedroom feature wall finish',
    'curved-staircase': 'Curved staircase installation',
    'elevator-lobby': 'Elevator lobby interior finish',
    'feature-door-installation': 'Feature door installation',
    'flooring-finish': 'Flooring finish work',
    'herringbone-flooring': 'Herringbone flooring installation',
    'herringbone-flooring-installation': 'Herringbone flooring installation',
    'interior-design-reference': 'Interior design reference',
    'living-room-tv-wall': 'Living room TV feature wall',
    'office-interior-render': 'Office interior render',
    'staircase-railing': 'Staircase railing installation',
    'wood-finish-detail': 'Wood finish detail work',
    'wood-flooring': 'Wood flooring installation',
    'wood-staircase': 'Wood staircase installation',
    'wood-staircase-detail': 'Wood staircase detail',
    'custom-kitchen': 'Custom kitchen cabinetry installation',
    'ceiling-electrical-installation': 'Ceiling electrical conduit installation',
    'floor-tiling': 'Large-format floor tile installation',
    'plumbing-installation': 'Plumbing installation',
    'plumbing-manifold': 'Plumbing manifold installation',
    'rooftop-piping-installation': 'Rooftop piping installation',
    'rooftop-water-tank': 'Rooftop water tank installation',
    'water-pump-installation': 'Water pump installation',
    'water-meter-manifold': 'Water meter and manifold installation',
    'wardrobe-installation': 'Wardrobe installation',
    'bookshelf-cabinetry': 'Custom bookshelf cabinetry',
    'marble-shower-wall': 'Marble shower wall finish',
    'living-room-finish': 'Living room interior finish',
    'stone-material-supply': 'Natural stone material supply',
    'ablution-area-installation': 'Ablution area installation',
    'electrical-panel-installation': 'Electrical panel installation',
};

// Short location/business context appended to every alt string for the folder's category.
const FOLDER_LOCATION_CONTEXT: Record<string, string> = {
    'construction-exteriors': 'Dubai villa construction site',
    interiors: 'Dubai villa interior fit-out',
    kitchens: 'Dubai villa',
    electrical: 'UAE construction site',
    'water-systems': 'UAE building',
};

function humanize(basename: string, folder: string): string {
    const match = basename.match(/^(.*?)(?:-(\d+))?$/);
    const root = match?.[1] ?? basename;
    const seq = match?.[2];

    const subject =
        SUBJECT_PHRASES[root] ??
        root
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    const context = FOLDER_LOCATION_CONTEXT[folder];

    let alt = context ? `${subject}, ${context}` : subject;
    if (seq) alt += ` — photo ${parseInt(seq, 10)}`;
    return alt;
}

export interface PhotoItem {
    kind: 'photo';
    basename: string;
    src: ImageMetadata;
    alt: string;
}

export interface VideoItem {
    kind: 'video';
    basename: string;
    src: string;
    poster: ImageMetadata;
    alt: string;
}

export type MediaItem = PhotoItem | VideoItem;

/** Returns portfolio media for one src/images/<folder> directory, photo+video pairs merged into single video tiles. */
export function getMediaForFolder(folder: string): MediaItem[] {
    const photosByBasename = new Map<string, ImageMetadata>();
    for (const [path, mod] of Object.entries(photoModules)) {
        const parsed = parsePath(path);
        if (parsed.folder !== folder || EXCLUDED_BASENAMES.has(parsed.basename)) continue;
        photosByBasename.set(parsed.basename, mod.default);
    }

    const postersByBasename = new Map<string, ImageMetadata>();
    for (const [path, mod] of Object.entries(posterModules)) {
        const parsed = parsePath(path);
        if (parsed.folder !== folder) continue;
        postersByBasename.set(parsed.basename, mod.default);
    }

    const videoBasenames = rawVideoPaths
        .map(parsePath)
        .filter((p) => p.folder === folder)
        .map((p) => p.basename);

    const items: MediaItem[] = [];

    for (const basename of videoBasenames) {
        // Prefer a dedicated poster frame; fall back to the same-stem photo if one exists
        // (a handful of clips ship with a matching jpeg from the same shot).
        const dedicatedPoster = postersByBasename.get(basename);
        const poster = dedicatedPoster ?? photosByBasename.get(basename);
        if (!poster) continue; // no poster generated yet — skip until the video pipeline runs
        items.push({
            kind: 'video',
            basename,
            src: withBase(`/videos/${folder}/${basename}.mp4`),
            poster,
            alt: humanize(basename, folder),
        });
        // Only drop the photo when it was actually borrowed as the poster above — a dedicated
        // poster means the same-basename photo is a coincidentally-numbered, unrelated asset
        // (sequence numbers don't imply a relationship between assets) and must stay visible.
        if (!dedicatedPoster) {
            photosByBasename.delete(basename);
        }
    }

    for (const [basename, src] of photosByBasename) {
        items.push({ kind: 'photo', basename, src, alt: humanize(basename, folder) });
    }

    return items.sort((a, b) => a.basename.localeCompare(b.basename, undefined, { numeric: true }));
}

/**
 * Picks the tile image for one portfolio category: the curated `cover` basename if set,
 * else the first photo (never a video's frame-grab poster, which reads noticeably blurrier
 * than an actual photo), else whatever's first. Shared by the homepage teaser and the
 * portfolio grid so their covers for the same category always match.
 */
export function getCoverForFolder(folder: string, cover?: string): ImageMetadata | null {
    const media = getMediaForFolder(folder);
    const chosen =
        media.find((item) => item.basename === cover) ??
        media.find((item) => item.kind === 'photo') ??
        media[0];
    return chosen ? (chosen.kind === 'photo' ? chosen.src : chosen.poster) : null;
}

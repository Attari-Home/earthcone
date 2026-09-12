import type { ImageMetadata } from 'astro';

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
    'interior-design-reference-01',
    'interior-design-reference-02',
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

function humanize(basename: string): string {
    return basename.replace(/-\d+$/, '').split('-').join(' ');
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
        const poster = postersByBasename.get(basename) ?? photosByBasename.get(basename);
        if (!poster) continue; // no poster generated yet — skip until the video pipeline runs
        items.push({
            kind: 'video',
            basename,
            src: `/videos/${folder}/${basename}.mp4`,
            poster,
            alt: humanize(basename),
        });
        photosByBasename.delete(basename); // don't also show the paired photo standalone
    }

    for (const [basename, src] of photosByBasename) {
        items.push({ kind: 'photo', basename, src, alt: humanize(basename) });
    }

    return items.sort((a, b) => a.basename.localeCompare(b.basename, undefined, { numeric: true }));
}

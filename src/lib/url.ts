// Prefixes an absolute path with the configured base (see astro.config.mjs).
// Needed because Astro does not rewrite hand-written `href`/`src` strings —
// only its own generated asset URLs pick up `base` automatically.
export function withBase(path: string): string {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    return path === '/' ? base || '/' : `${base}${path}`;
}

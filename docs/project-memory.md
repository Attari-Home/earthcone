# Earth Cone — Project & Chat Memory

## Purpose

This repository is being prepared as a website asset library for Earth Cone. The current work focused on making the supplied WhatsApp media easy to use in a website by organizing it into descriptive, URL-friendly paths.

## Work completed

All original `WhatsApp Image ...` and `WhatsApp Video ...` filenames were replaced with lowercase, hyphenated, descriptive names. Assets were moved from the root of `src/images/` into service/project categories. No image or video content was edited, compressed, or deleted.

### Asset inventory

| Folder | JPEG images | MP4 videos | Primary subject |
| --- | ---: | ---: | --- |
| `src/images/branding/` | 9 | 0 | Earth Cone business cards, site signboard, awards/certificates, company vehicle |
| `src/images/construction-exteriors/` | 20 | 8 | Villas, facades, foundations, paving, decking, stone material supply |
| `src/images/electrical/` | 3 | 2 | Electrical conduit, ceiling installation, panel installation |
| `src/images/interiors/` | 55 | 35 | Finished interiors, flooring, TV walls, stairs, doors, vanities, wardrobes, bookshelves, marble shower walls |
| `src/images/kitchens/` | 46 | 0 | Custom kitchen projects |
| `src/images/water-systems/` | 30 | 2 | Rooftop tanks, piping, manifolds, water pumps, ablution area, plumbing install |
| **Total** | **163** | **47** | **210 media files** |

A second WhatsApp export batch (`new_images_Videos/`, 72 images + 31 videos) was categorized and merged into the library above on 2026-09-14. 7 exact-duplicate images and 9 exact-duplicate videos (identical bytes, re-sent under a different WhatsApp filename) were identified by hash and discarded rather than imported twice — see "Duplicate detection" below. One further duplicate (`earth-cone-business-cards-03.jpeg`, byte-identical to the pre-existing `earth-cone-business-cards-02.jpeg`) slipped through that pass because it was only hashed against other new-batch files, not the full existing library — caught and removed the same day; **hash new imports against the full library, not just against each other, next time.**

`earth-cone-certificate-01-flat.jpeg` is a derived asset, not a raw import: a perspective-corrected ("deskewed"), contrast-boosted crop of a high-res certificate rescan (client-supplied PDF, not the original WhatsApp photo — the PDF scan was sharper and closer to front-on, giving a much cleaner result), produced with Python/Pillow (`Image.transform(..., Image.QUAD, ...)`) so it reads as a flat scanned document instead of a photo of a framed object on a wall. `earth-cone-certificate-framed.jpeg` is a second, separate client-supplied rescan of the same certificate while still framed/on-wall (used as-is, only cropped+sharpened — that photo was already near-frontal, no perspective correction needed). Both live on `/recognition` alongside the award photo. Source photos untouched; keep this pattern (derive a named variant rather than overwriting) if more framed/angled documents show up.

`public/logo-mark.png` is a derived asset too: the building-icon mark cropped out of the business-card render (`earth-cone-business-cards-02.jpeg`) and made transparent via a luminance-based chroma-key in Pillow (background is a flat white/near-white in that render, so a simple whiteness threshold + Gaussian-blurred alpha edge was enough — no need for a real background-removal model). Used in the site header next to the wordmark. If a better/official logo file ever arrives from the client, replace this file directly rather than re-deriving it.

Hero slideshow images (`src/images/hero/hero-*.jpeg`) got a signature typography treatment on the homepage: one word ("properties") renders in Fraunces' own italic SOFT/opsz variable axis (not a separate script font) — see the `.hero-cursive` comment in `global.css` and the `full-italic.css` import in `Hero.astro`. Deliberate choice: same type family as the rest of the display type, different voice, rather than bolting on an unrelated script font that would clash with the site's established serif identity.

## Hero image upgrade (2026-09-15)

Replaced all 5 original phone-camera hero images with professional high-resolution images sourced from Unsplash and Pexels. All images are licensed under the Unsplash License or Pexels License (free for commercial use, no attribution required, no modification restrictions). The original `hero-*.jpeg` files remain in `src/images/hero/` as archived originals but are no longer imported by `Hero.astro`.

| Slide | Service | File | Source | Description |
| --- | --- | --- | --- | --- |
| 0 | Construction | `frames-for-your-heart-_KP6mk2Iz8k-unsplash.jpg` | Unsplash — Frames For Your Heart | Modern white villa exterior with palm trees and garden hedge, landscape orientation, natural daylight |
| 1 | Interiors | `aalo-lens-UlIj_qKpgCw-unsplash.jpg` | Unsplash — Aalo Lens | Luxury dark interior with marble island, gold pendant lamp, wood-panelled walls, open dining area beyond |
| 2 | Kitchens | `brian-zajac-n8wF-38dASg-unsplash.jpg` | Unsplash — Brian Zajac | Wide all-white luxury kitchen, gold accents, calacatta marble island + floor, overhead shot — best landscape kitchen frame |
| 3 | Electrical | `pexels-ranamatloob567-35189704.jpg` | Pexels — Rana Matloob | Contemporary luxury kitchen with dramatic multi-ring gold LED chandelier, champagne gloss cabinetry, marble floor — showcases premium lighting/electrical design |
| 4 | Water systems | `shoham-avisrur-Kskxj4M8jmI-unsplash.jpg` | Unsplash — Shoham Avisrur | Modern taupe matte kitchen with integrated plumbing fixtures, concrete-look island, pendant lights — sleek, understated, plumbing-adjacent |

### Images downloaded but not used (available as alternates)

| File | Why not used |
| --- | --- |
| `brecht-corbeel-F5cdYZAarbo-unsplash.jpg` | Portrait orientation crops awkwardly in wide hero banner; good close-up kitchen detail but loses context |
| `brian-zajac-ynVu56fpbN8-unsplash.jpg` | High-quality white+gold kitchen (overhead angle) — very similar to `n8wF-38dASg`; use as a replacement if a slightly different kitchen composition is preferred |
| `franco-debartolo-3x365ToKOK8-unsplash.jpg` | Dark, moody kitchen counter close-up with decorative vessels — dramatic atmosphere but portrait and too abstract for a hero |
| `marina-nazina-bhV15497Nr8-unsplash.jpg` | All-black kitchen with marble backsplash (portrait) — striking but orientation and extreme darkness work against the hero overlay text |

## Homepage v2 (2026-09-14 follow-up)

The landing page grew substantially in the same session: About/Coverage/"How we work" sections added after Recent Work, animated stat counters on the existing stats band, and the Coverage section's emirate list became a clickable 7-block "blueprint" grid (`index.astro`, CSS grid with hand-placed `col-start`/`row-start` per emirate — deliberately abstract/schematic, not a geographic map, specifically to avoid using a copyrighted (CC-BY-SA, share-alike) map dataset on a commercial client site).

`src/components/BeforeAfterSlider/BeforeAfterSlider.astro` was built (drag-to-compare, keyboard accessible via a range input) but is **not wired into any page** — the asset library has no confirmed genuine before/after pair (same room, two points in time); every "in-progress vs finished" pairing I checked turned out to be two different rooms. Do not populate this component with a guessed pairing — wait for the client to confirm two photos of the same space, or ask them directly.

`src/components/Header/Header.astro`: nav grew from 5 to 7 items (added Recognition, FAQ) and the full-nav breakpoint moved from `md:` (768px) to `lg:` (1024px) so it doesn't overflow at tablet widths — the mobile hamburger now covers a wider range.

Testing note: this session's embedded Browser pane had `element.scrollIntoView()` / `window.scrollTo()` (JS-driven scroll) silently no-op — `window.scrollY` never changed. The tool's own `computer` action `scroll_to` (ref-based) worked correctly and did trigger the real IntersectionObserver reveals. If a future session sees "reveal never fires" while scrolled programmatically via JS, try the dedicated scroll tool action before assuming a real bug.

## Naming convention

Every asset uses a semantic lowercase filename plus a two-digit sequence number:

```text
<subject>-<detail>-<number>.<extension>
```

Examples:

```text
src/images/kitchens/custom-kitchen-01.jpeg
src/images/water-systems/rooftop-water-tank-01.jpeg
src/images/construction-exteriors/villa-facade-01.jpeg
src/images/interiors/herringbone-flooring-01.mp4
src/images/interiors/bathroom-vanity-installation-01.mp4
```

Use these paths directly in website components. The number distinguishes related shots; it does not imply a rank or preferred display order.

## Content grouping notes

- `branding`: brand collateral only; appropriate for About, Contact, and brand-story sections. Not wired into any `projects` content-collection entry, so nothing in this folder appears in the public `/portfolio` grid — safe home for internal/promotional assets (awards, certificates, signboard, company vehicle) that aren't "completed project" shots.
- `construction-exteriors`: exterior construction progress and completed villa façades, plus raw stone material stockyard photos; appropriate for portfolio or construction-services sections.
- `electrical`: installation-process images and videos (conduits, ceiling runs, distribution panels); appropriate for electrical-services sections.
- `interiors`: interior finish work and video showcases. Subjects include herringbone flooring, TV feature walls, doors, bathroom vanities, marble shower walls, staircase details, wardrobes, custom bookshelf cabinetry, elevator lobbies, and general flooring finishes.
- `kitchens`: completed custom kitchens; suitable for a kitchen gallery or service page.
- `water-systems`: rooftop water tanks, plumbing manifolds, piping, pumps, general plumbing installation, and mosque/majlis-style ablution (wudu) area fixtures; suitable for plumbing or water-system services.

### New subjects introduced in the second batch (2026-09-14)

Added to `SUBJECT_PHRASES` in `src/lib/portfolioMedia.ts` so alt text stays descriptive per CLAUDE.md §5:

- `wardrobe-installation` (interiors) — fitted wardrobe/closet installs.
- `bookshelf-cabinetry` (interiors) — open-shelf wood-slat bookshelf/storage units.
- `marble-shower-wall` (interiors) — bookmatched marble shower wall/niche finishes.
- `living-room-finish` (interiors) — general finished/handover living room shots without a specific TV-wall or flooring focus.
- `stone-material-supply` (construction-exteriors) — palletized natural stone stock photographed at a supplier yard.
- `ablution-area-installation` (water-systems) — mosque/majlis-style wudu (ablution) washroom fixture rows.
- `electrical-panel-installation` (electrical) — distribution panel/wiring installs.

### Duplicate detection

The second export batch had the same content re-sent multiple times under different WhatsApp timestamps (e.g. the site signboard and awards were exported once around 8:40 PM and again around 8:42 PM). Before importing, every file was hashed with `md5sum`; byte-identical duplicates were dropped, keeping only the earliest-timestamped copy. If a future batch shows the same pattern, hash first — don't assume distinct filenames mean distinct content.

## Maintenance rules

1. Add future media to the closest existing category folder.
2. Keep names lowercase, hyphenated, and descriptive; avoid spaces, timestamps, and vendor-app names.
3. Continue a related asset sequence rather than renumbering existing files.
4. Preserve the current extensions unless intentional media optimization is performed separately.
5. If website code starts referencing an asset path, treat that path as stable and avoid renaming it without updating the reference.

## Verification performed

- Confirmed that all 98 JPEGs were moved out of the `src/images/` root and successfully opened after renaming.
- Confirmed that all 25 MP4 files were moved out of the `src/images/` root and retained valid MP4 media signatures.

## Video pipeline (added during premium redesign)

All 25 source MP4s in `src/images/` are raw, uncompressed WhatsApp exports (~184MB total) and stay untouched there — they are never served directly. A separate compression pass produces the web-served copies:

- Compressed video: `public/videos/<folder>/<same-basename>.mp4` — `ffmpeg`, `libx264`, `-preset slow -crf 28`, native resolution preserved (no downscale), `-movflags +faststart`, audio re-encoded to AAC 80kbps where present. Result: ~184MB → ~89MB (~52% smaller) at unchanged resolution.
- Poster frames: `src/images/video-posters/<folder>/<same-basename>.jpeg` — a new category folder, flows through the normal `astro:assets`/`sharp` pipeline like any other photo (unlike `public/videos/`, which is a plain static passthrough). Extracted via `ffmpeg -ss 00:00:01 -frames:v 1`.
- `src/lib/portfolioMedia.ts` discovers videos from the raw `src/images/<folder>/*.mp4` filenames, then points playback at the corresponding `public/videos/` path and poster at the corresponding `video-posters/` image — so re-running the compression script for a newly added clip is enough to make it appear in the portfolio grid, no code change needed.
- If a new video is added to `src/images/<folder>/`, re-run the compression pipeline (documented in the redesign plan) to produce its `public/videos/` and `video-posters/` counterparts before it will render on the site.
- The original raw MP4 blobs remain permanently in `.git` history from the commit that first added them — this was flagged to the client as a separate, explicit sign-off item (history rewrite is destructive and out of scope for routine asset maintenance).


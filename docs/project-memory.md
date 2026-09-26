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
| `src/images/korean-marble/` | 8 | 2 | Korean marble (acrylic solid surface) restaurant counters: buffet runs, induction-hob cut-outs, curved counter ends |
| `src/images/water-systems/` | 30 | 2 | Rooftop tanks, piping, manifolds, water pumps, ablution area, plumbing install |
| **Total** | **171** | **49** | **220 media files** |

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

### Social share image, current default (2026-09-26)

`public/og-services.jpg` (1200×630, ~114 KB) replaced the tower-crane image below as the default link preview: the client wanted it to show the main work, services and maintenance, not a high-rise site. It is a Pillow collage (dark brand panel with logo, headline "Construction & Maintenance Contractor", and a 3×2 grid of real Earth Cone photos with service labels). Photos used: `construction-exteriors/villa-facade-01`, `interiors/living-room-tv-wall-01`, `kitchens/custom-kitchen-12`, `korean-marble/induction-hob-counter-01`, `electrical/ceiling-electrical-installation-01`, `water-systems/plumbing-manifold-01` (all `.jpeg`). Swap photos by rebuilding the collage under a new filename. Each service page and portfolio category additionally uses its own photo as its preview image (`src/lib/ogImage.ts`).

### Social share image, previous default (2026-09-16)

`public/og-image.jpg` (1200×630, ~91 KB) is the link-preview thumbnail WhatsApp, Facebook, LinkedIn, and X show when the site is shared. It replaced `og-default.jpg`, a phone photo of a finished yellow villa that the client felt undercut the site's premium look. The client asked for "attractive and industrial construction work" instead.

| File | Source | Description |
| --- | --- | --- |
| `src/images/hero/tye-doring-a7xke_rxZRs-unsplash.jpg` (2400×1663 source) | Unsplash — Tye Doring, [three tower cranes](https://unsplash.com/photos/three-tower-cranes-a7xke_rxZRs), Unsplash License | Three tower cranes silhouetted against a warm sunset over a building under construction |

The share image is a bottom-anchored cover crop of that source (`sharp`, mozjpeg q90, 4:4:4 chroma so the gradient sky doesn't band). Bottom-anchored keeps the building silhouettes and the warm band and drops the cooler teal upper sky. Its dimensions and alt text are declared as `og:image:width/height/alt` in `SEO.astro`. If the image is ever swapped, give it a new filename: link-preview caches (Facebook, LinkedIn, Cloudflare's edge) key on the image URL.

Two other free candidates were shortlisted and not used: Etienne Girardet's "two men working" (`sgYamIzhAhg`), a rebar deck from above, very widely reused stock; and Abhishek Kirloskar's workers silhouetted in steel at dusk (`ncqwTBV5qCA`), which is too busy at thumbnail size.

### Images downloaded but not used (available as alternates)

| File | Why not used |
| --- | --- |
| `brecht-corbeel-F5cdYZAarbo-unsplash.jpg` | Portrait orientation crops awkwardly in wide hero banner; good close-up kitchen detail but loses context |
| `brian-zajac-ynVu56fpbN8-unsplash.jpg` | High-quality white+gold kitchen (overhead angle) — very similar to `n8wF-38dASg`; use as a replacement if a slightly different kitchen composition is preferred |
| `franco-debartolo-3x365ToKOK8-unsplash.jpg` | Dark, moody kitchen counter close-up with decorative vessels — dramatic atmosphere but portrait and too abstract for a hero |
| `marina-nazina-bhV15497Nr8-unsplash.jpg` | All-black kitchen with marble backsplash (portrait) — striking but orientation and extreme darkness work against the hero overlay text |

## Korean marble service (2026-09-17)

The client asked for a new service line, Korean artificial marble (acrylic solid surface, often called Corian after the best-known brand), with its own work category. They supplied two WhatsApp videos and asked for stills taken from them plus free stock photos.

### Client videos and extracted stills

- Raw videos: `src/images/korean-marble/solid-surface-counter-installation-01.mp4` (56 s) and `-02.mp4` (25 s). Both are 478×850 portrait WhatsApp exports of the same restaurant/buffet counter install. Their hashes were checked against the full library first, and neither is a duplicate.
- Compressed copies in `public/videos/korean-marble/` use the standard pipeline (CRF 28, native resolution, audio removed): 12.6 MB became 4.4 MB and 5.5 MB became 1.7 MB.
- Eight stills in `src/images/korean-marble/`. Frames were extracted at 10 fps and scored by sharpness (Laplacian variance). The sharpest native frame near each good moment was kept, skipping frames with hands, faces, or bystanders in shot. Each still got a light `autocontrast` (0.5% cutoff) and a mild unsharp mask in Pillow. They are 478×850 because that is the source video's resolution, so they look soft at large tile sizes. Better photos from the client would help.
- Posters for the two videos are separate frames, not reused stills, so a video tile never looks like a duplicate of a photo next to it.
- New `SUBJECT_PHRASES`: `induction-hob-counter`, `curved-counter-end`, `buffet-counter`, `counter-edge-detail`, `serving-counter`, `curved-island-counter`, `solid-surface-counter-installation`. Folder context: "restaurant fit-out". No city is named because the video does not show where the job is.

### Stock photos (service page only)

These are stored in `src/images/stock/korean-marble/` and used only on `/services/korean-marble`: the hero, plus the "Where Korean marble is used" section, which is labelled as reference photography. They are deliberately not in the portfolio, which shows only Earth Cone's own work. Every photo was checked through Unsplash's API as `premium: false, plus: false`, so all are under the standard Unsplash License: free for commercial use, no attribution required. Unsplash+ images were excluded. Each was viewed at full size to check for visible logos or brand labels.

| File | Unsplash photo | Photographer | Used as |
| --- | --- | --- | --- |
| `intenzafitness-ORecYn0PCdU-unsplash.jpg` | `ORecYn0PCdU` | Intenza Fitness | Hero — angular white reception counter with LED strip |
| `alextyson195-YWxpCIqfDKs-unsplash.jpg` | `YWxpCIqfDKs` | Alex Tyson | Kitchen worktops and islands |
| `sanibell-6BV9b7LRXPo-unsplash.jpg` | `6BV9b7LRXPo` | Sanibell BV | Vanity top with built-in trough basin |
| `sanibell-XhQ0vUA40ng-unsplash.jpg` | `XhQ0vUA40ng` | Sanibell BV | Wall-hung double vanity |
| `alken-zHWdhQ0Jubg-unsplash.jpg` | `zHWdhQ0Jubg` | Alfred Kenneally | Seamless integrated sink close-up |
| `kasiade-mttfw1ihj6k-unsplash.jpg` | `mttfw1ihj6k` | Kaptured by Kasia | Multi-basin washroom counter (Munch Museum, Oslo) |
| `heqinglan0602_tianya-ECBg5FQkBXI-unsplash.jpg` | `ECBg5FQkBXI` | 何青蓝 | Curved reception desk |

Rejected: `26Qw6xsC8hY` (a white worktop with a flush induction hob, which would have been a good fit, but a Compagnie de Provence soap bottle label is legible in the frame) and `x5wbZZE0aIw` (a clearly CG-rendered vanity).

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
- `electrical`: installation-process images and videos (commercial ceiling lighting and containment, distribution panels); appropriate for electrical-services sections.
- `interiors`: interior finish work and video showcases. Subjects include herringbone flooring, large-format floor tiling, TV feature walls, doors, bathroom vanities, marble shower walls, staircase details, wardrobes, custom bookshelf cabinetry, elevator lobbies, and general flooring finishes.
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

### Mislabeled assets corrected (2026-09-16)

While writing service-page copy against the photos, a spot-check (~20 files, opened and looked at one by one) found filenames describing something other than what the image shows. Corrected with `git mv` and matching `SUBJECT_PHRASES` updates so alt text stays accurate:

- `electrical/floor-electrical-conduits-01.jpeg`, `-02.jpeg` → `interiors/floor-tiling-01.jpeg`, `-02.jpeg` — large-format porcelain floor tiles being laid on levelling clips; no conduit visible. The `floor-electrical-conduits` phrase was removed; `floor-tiling` added.
- `construction-exteriors/foundation-construction-02.jpeg` → `water-systems/water-meter-manifold-01.jpeg` — a PPR manifold with per-outlet water meters and a pressure-reducing valve, not foundation work. `water-meter-manifold` phrase added. `foundation-construction-01` and `-03` are genuine and unchanged (the sequence gap is deliberate — see maintenance rule 3).
- `construction-exteriors/villa-construction-03.jpeg` — a phone screenshot with the gallery app's own UI (close button, "Save", "New Stylized Photo" caption) baked into the image. Left in place but added to `EXCLUDED_BASENAMES` in `src/lib/portfolioMedia.ts` until the client supplies a clean export.

Roughly 180 files have not had this check. Treat a filename as a claim to verify, not a description to trust.

### Duplicate detection

The second export batch had the same content re-sent multiple times under different WhatsApp timestamps (e.g. the site signboard and awards were exported once around 8:40 PM and again around 8:42 PM). Before importing, every file was hashed with `md5sum`; byte-identical duplicates were dropped, keeping only the earliest-timestamped copy. If a future batch shows the same pattern, hash first — don't assume distinct filenames mean distinct content.

## Maintenance rules

1. Add future media to the closest existing category folder.
2. Keep names lowercase, hyphenated, and descriptive; avoid spaces, timestamps, and vendor-app names.
3. Continue a related asset sequence rather than renumbering existing files.
4. Preserve the current extensions unless intentional media optimization is performed separately.
5. If website code starts referencing an asset path, treat that path as stable and avoid renaming it without updating the reference.
6. Open the image before naming it, filing it, or writing alt text or copy about it — the source exports carry no reliable labels, and three files were misfiled under names that matched the wrong trade.

## Verification performed

- Confirmed that all 98 JPEGs were moved out of the `src/images/` root and successfully opened after renaming.
- Confirmed that all 25 MP4 files were moved out of the `src/images/` root and retained valid MP4 media signatures.

## Video pipeline (added during premium redesign)

All 25 source MP4s in `src/images/` are raw, uncompressed WhatsApp exports (~184MB total) and stay untouched there — they are never served directly. A separate compression pass produces the web-served copies:

- Compressed video: `public/videos/<folder>/<same-basename>.mp4` — `ffmpeg`, `libx264`, `-preset slow -crf 28`, native resolution preserved (no downscale), `-movflags +faststart`, no audio track (`-an`, see below). Result: ~184MB → ~89MB (~52% smaller) at unchanged resolution.
- Poster frames: `src/images/video-posters/<folder>/<same-basename>.jpeg` — a new category folder, flows through the normal `astro:assets`/`sharp` pipeline like any other photo (unlike `public/videos/`, which is a plain static passthrough). Extracted via `ffmpeg -ss 00:00:01 -frames:v 1`.
- `src/lib/portfolioMedia.ts` discovers videos from the raw `src/images/<folder>/*.mp4` filenames, then points playback at the corresponding `public/videos/` path and poster at the corresponding `video-posters/` image — so re-running the compression script for a newly added clip is enough to make it appear in the portfolio grid, no code change needed.
- **No audio anywhere (2026-09-17):** the client asked for every video in the repo to be silent. The audio track was removed from all 47 files that had one: 45 raw sources in `src/images/` and the 2 Korean marble copies in `public/videos/`. It was a stream copy (`ffmpeg -map 0:v -c copy -an -movflags +faststart`), so the video bitstream is untouched. Codec, resolution, frame count, and rotation were compared before and after each file. New clips must be stripped the same way before they are committed, both the raw source and the compressed copy.
- If a new video is added to `src/images/<folder>/`, re-run the compression pipeline (documented in the redesign plan) to produce its `public/videos/` and `video-posters/` counterparts before it will render on the site.
- The original raw MP4 blobs remain permanently in `.git` history from the commit that first added them — this was flagged to the client as a separate, explicit sign-off item (history rewrite is destructive and out of scope for routine asset maintenance).


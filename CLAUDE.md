# CLAUDE.md

This file guides Claude Code (and any contributor) working in this repository. It defines the target architecture, conventions, and workflow for the Earth Cone website. Keep it updated as decisions change — it is the source of truth, not `docs/project-memory.md` (which is an asset-organization log).

## 1. Project overview

**Earth Cone** is a building construction & maintenance contracting company headquartered in Dubai, licensed to operate across **all seven Emirates** (Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain). The site's job is to generate qualified leads (calls, WhatsApp, form submissions) from people searching for a contractor anywhere in the UAE.

Service lines evidenced by the current asset library (`src/images/`, see `docs/project-memory.md`):

- Construction (villas, foundations, exteriors, paving, decking)
- Interior fit-out (flooring, staircases, feature walls, doors, vanities)
- Custom kitchens
- Electrical installation
- Water systems (plumbing, rooftop tanks, manifolds, pumps)
- General maintenance (implied by "construction and maintenance" positioning — confirm scope with the client before building a Maintenance service page)

Non-negotiable quality bar for every page shipped: **fast, responsive, accessible, SEO-optimized, and AI/answer-engine friendly.**

## 2. Tech stack

This repo follows the same proven stack as the sibling project [`lailonahar-website`](https://github.com/Attari-Home) (also UAE-wide, also lead-gen, already tuned to near-perfect Lighthouse scores) for consistency across the portfolio and to reuse conventions:

| Layer      | Choice                                                   | Why                                                                                                                                                                              |
| ---------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework  | [Astro 7](https://astro.build/) (static output)          | Ships zero JS by default; ideal for a mostly-static marketing/lead-gen site; best-in-class Core Web Vitals                                                                      |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`)                    | Utility-first, small final CSS, fast iteration                                                                                                                                   |
| Icons      | `astro-icon` + an Iconify set (e.g. `@iconify-json/ph`)  | Inlined SVG, no icon font                                                                                                                                                        |
| Images     | `astro:assets` + `sharp`                                 | Automatic AVIF/WebP + responsive `srcset`                                                                                                                                        |
| Content    | Astro Content Collections (MDX)                          | Type-safe service/project/testimonial entries                                                                                                                                    |
| Routing    | Astro View Transitions                                   | SPA-like feel without a JS framework                                                                                                                                             |
| Forms      | Web3Forms (or equivalent)                                | No backend needed for a static site                                                                                                                                              |
| Hosting    | Cloudflare (Workers/Pages, Git-connected)            | `earthconecontracting.com`, purchased and hosted on Cloudflare — deploys straight from the Cloudflare dashboard's own Git integration, not GitHub Actions — see §9/§10     |
| Language   | TypeScript (strict)                                      | Type-safe content schemas and utilities                                                                                                                                          |
| Formatting | Prettier + `prettier-plugin-astro`                       | One canonical format, enforced in CI                                                                                                                                             |

Do not introduce a second frontend framework (React/Vue/etc.) unless a specific interactive feature genuinely requires it — and then use an Astro island, not a full SPA rewrite.

## 3. Target architecture

Scaffolded and current as of the premium redesign:

```
public/                 Static files served as-is (robots.txt, favicon, llms.txt, videos/)
  favicon.svg            Source favicon — a simplified vector of the logo-mark.png towers-and-roof mark, legible
                          at 16px. favicon-16x16/32x32.png are rasterized from it; apple-touch-icon.png is the
                          full logo on opaque white (iOS renders transparency as black). Bump the ?v= on the icon
                          links in BaseLayout.astro whenever these change, or browsers keep the cached old icon.
  videos/<folder>/       Compressed MP4s (see §6) — never the raw src/images/ sources
src/
  icons/services/        Custom duotone scope illustrations used by ServiceCard (astro-icon local icons, iconDir
                          src/icons). Drawn on a 48px grid, 1.25 stroke, currentColor + 18% fill accents, so hover
                          color changes need no per-icon CSS
  images/                Categorized media library (see docs/project-memory.md) — do not rename paths once referenced
  images/video-posters/  Poster-frame JPEGs for portfolio video tiles, one subfolder per category
  components/            One folder per component (Header, Footer, Hero, ServiceCard, ServiceGrid,
                          PortfolioCard, Breadcrumbs, CtaBand, ContactForm, SEO, ...)
  content/
    services/            One entry per service line (construction, interiors, kitchens, electrical, water-systems)
    projects/            One entry per portfolio category, schema {title, summary, order, folder, serviceSlug?}
                          — `folder` maps the category slug to its src/images/ directory name
  data/
    site.ts              Business data: name, contacts.{phones,whatsapp,emails} (arrays, each with one
                          primary: true), address, license, emirates served, socials
  lib/
    portfolioMedia.ts     import.meta.glob-based helper: buckets src/images/*/*.jpeg + *.mp4 by folder,
                          pairs same-stem photo+video into one tile, points video src/poster at
                          public/videos/ and src/images/video-posters/
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    services/[slug].astro
    services/index.astro
    portfolio/index.astro
    portfolio/[category].astro   Reads the `projects` collection + portfolioMedia.ts
    about.astro
    contact.astro
    service-areas.astro         Single page listing all emirates served (see SEO strategy — avoid thin per-city pages)
    404.astro
  styles/
    global.css            Design tokens (color, spacing/type scale, easing), .eyebrow/.bleed/.container-wide/
                          .media-tile utilities, reset, shared component styles
  content.config.ts
docs/
  project-memory.md       Asset naming/organization log + video pipeline notes — keep maintaining per its own rules
```

Keep one component per directory with its `.astro` file; colocate component-specific styles inline (Tailwind) rather than separate CSS files unless truly shared.

## 4. SEO strategy

- **Structured data**: `GeneralContractor` (or `HomeAndConstructionBusiness`) JSON-LD on every page via a shared `<SEO>` component, including `areaServed` for all licensed Emirates. Add `Service` schema on service pages and `BreadcrumbList` site-wide.
- **Location strategy**: do not mass-generate thin "service in [city]" doorway pages with duplicate content — that gets penalized. Instead, ship one substantial, unique `/service-areas` (or `/locations`) page naming every Emirate served, and only build a dedicated location landing page for an Emirate once there is genuinely unique content (project photos, testimonials) to put on it.
- **Services vs Portfolio are deliberately separate, and must stay visually distinct.** Both are standard on contractor sites and do different jobs: a per-service page is what ranks for intent searches ("villa construction Dubai") and carries the `Service` schema, while the portfolio is the proof-of-work/trust surface. Do not merge or delete either. They _did_ read as duplicates once, because both rendered the same photo-tile card over the same five categories in the same order — the fix is differentiation, not removal: service cards are icon-led capability cards (`ServiceCard`), portfolio tiles are photo-led (`PortfolioCard`), and a service page shows only a short gallery teaser (`GALLERY_TEASER_COUNT` in `services/[slug].astro`) that links out to the full category gallery.
- **On-page basics**: unique `<title>` and meta description per page, canonical URLs, Open Graph + Twitter Card images, semantic HTML (`<h1>` once per page, proper heading order, `<nav>`/`<main>`/`<footer>` landmarks).
- **Technical SEO**: `@astrojs/sitemap`, `robots.txt`, trailing-slash consistency, no orphan pages — every page reachable from a nav or sitemap link.
- **Local SEO**: register/verify a Google Business Profile per operating Emirate where feasible (outside this repo's scope, but the site must support it — consistent NAP (name/address/phone) in footer and JSON-LD).
- **Core Web Vitals** are an SEO ranking factor as well as a UX requirement — see Performance budget below.

## 5. AI-friendliness / Answer Engine Optimization (AEO)

The site should be easy for both search crawlers and AI agents/answer engines (ChatGPT, Perplexity, Google AI Overviews) to parse and cite correctly:

- Ship an `llms.txt` at the site root summarizing the business, services, and service area in plain language, with links to key pages.
- Prefer clean semantic HTML over div-soup; content should read correctly with CSS/JS disabled.
- Write descriptive, specific `alt` text for every image (not "kitchen1.jpg" — "custom kitchen cabinetry installation, Dubai villa").
- Answer common questions directly in page copy (e.g. "Which Emirates does Earth Cone operate in?", "Do you handle both construction and maintenance?") — this is also what FAQ-rich-result and AI-overview extraction relies on. Add `FAQPage` JSON-LD where genuine Q&A content exists.
- Keep pages fast and lightweight (see below) — many AI crawlers and preview fetchers time out or truncate on slow/heavy pages.

## 6. Performance budget

Target and enforce via Lighthouse CI (mirror the sibling project's `lighthouserc.json`):

| Category       | Minimum score |
| -------------- | ------------- |
| Performance    | 0.95          |
| Accessibility  | 1.0           |
| Best Practices | 0.95          |
| SEO            | 1.0           |

Rules to hit that budget:

- No render-blocking JS; interactivity is progressive enhancement only.
- All images through `astro:assets` (auto AVIF/WebP, explicit `width`/`height` to avoid CLS, `loading="lazy"` below the fold).
- **Video**: `src/images/` holds the raw, uncompressed WhatsApp-export MP4 sources (~184 MB, some 30–40 MB each) — these are never served directly. Compressed copies live in `public/videos/<folder>/`, produced with `ffmpeg`, `libx264`, `-preset slow -crf 28`, **native resolution preserved (no downscale — the client explicitly wants quality/resolution kept)**, `-movflags +faststart`. This roughly halves file size (~184 MB → ~89 MB) at unchanged resolution; do not downscale to 720p even though that would compress further. Poster frames live in `src/images/video-posters/<folder>/` and flow through the normal `astro:assets` pipeline. `<video preload="none" poster={...} controls muted playsinline>` — never autoplay. See `docs/project-memory.md` for the full pipeline and re-run instructions when new clips are added.
    - **Still open**: the original raw MP4 blobs remain permanently in `.git` history from the commit that added them (~170 MB). Purging them requires a destructive history rewrite (BFG/`git-filter-repo`, force-push) — flagged to the client as a separate explicit sign-off, not done as part of routine builds.
- Self-host fonts (or use `font-display: swap`), subset where practical.

## 7. Accessibility

- WCAG 2.1 AA minimum. Lighthouse Accessibility must stay at 1.0 (see budget above).
- All interactive elements keyboard-reachable with visible focus states.
- Color contrast checked against the design tokens in `src/styles/global.css`.
- Forms: labeled inputs, inline validation errors announced to screen readers.

## 8. Coding conventions

- TypeScript strict mode; no `any` without a comment explaining why.
- Prettier is the formatter of record (`npm run format` / `npm run lint` = `prettier --check`), run in CI — don't hand-format.
- Component naming: PascalCase folder + file (`ServiceCard/ServiceCard.astro`).
- No unused abstractions ahead of need — three similar service-card usages is fine without a generic "card system"; extract only when a real third variant demands it.
- Business data (phone numbers, emails, emirate list, license number) lives in one place (`src/data/site.ts`), never hardcoded per-page.

## 9. Git workflow & branch protection

- `main` is the production branch, deployed automatically to Cloudflare (custom domain `https://earthconecontracting.com`) — see §10. **`main` is protected: no direct pushes, all changes land via pull request.**
- Feature branches: `feature/<short-name>`, `fix/<short-name>`, `content/<short-name>`.
- Commit messages: concise, imperative mood, explain _why_ not _what_ (e.g. `Fix hero LCP by preloading hero image`, not `update code`).
- PRs use `.github/PULL_REQUEST_TEMPLATE.md` (add one mirroring the sibling project: summary, type of change, build/test checklist, screenshots for visual changes).
- Squash-merge PRs into `main` to keep history linear and readable.
- The GitHub ruleset enforced on `main` (configured at the repo/org level, not in code):
    - Require a pull request before merging.
    - Require at least 1 approving review from someone with write access. GitHub never lets a PR's author approve their own PR, so every merge needs a second account to approve it — plan for that wait, it can't be bypassed from the author's account.
    - Block force-pushes and branch deletion.
    - Require the CI status check to pass before merging (once `ci.yml` exists — see below).
    - See the repo's Settings → Rules → Rulesets for the live configuration.

## 10. CI/CD

Add these GitHub Actions workflows (mirroring the sibling project) once the app is scaffolded:

- `.github/workflows/ci.yml` — on PR to `main`: install, `astro check`, `astro build`, `prettier --check`. This is the required status check for the branch ruleset.
- `.github/workflows/lighthouse.yml` — on PR to `main`: build, run Lighthouse CI against the thresholds in §6.
- **Deployment is not a GitHub Actions workflow.** The domain `earthconecontracting.com` was purchased through Cloudflare and the repo is connected directly to a Cloudflare Workers/Pages project via Cloudflare's own Git integration — Cloudflare builds (`npm run build`) and deploys (`npx wrangler deploy`) on every push to `main` from its own side, independent of anything in `.github/workflows/`. There is nothing to configure in this repo for that (no `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` secrets needed); changes to the build happen in the Cloudflare dashboard for that project.
- `wrangler.jsonc` at the repo root is required for that deploy to actually work: Cloudflare's Workers platform (unlike its older Pages product) has no framework-preset auto-detection, so without an explicit `assets.directory` pointing at `dist`, `wrangler deploy` uploads only a near-empty Worker shell — none of the actual site (images, videos, fonts included) goes with it. Do not delete this file.
- Pushes to `main` auto-trigger a Cloudflare build via its GitHub App integration. If this ever stops firing again, check that the `cloudflare-workers-and-pages` GitHub App still has this repo in its "Repository access" list under the org's installed Apps (`github.com/organizations/<org>/settings/installations/<id>`) — that App defaults to "selected repositories," and `earthcone` was silently left out of it once already, which is why deploys briefly needed manual triggering from the dashboard (Deployments → Builds → Retry build).
- **Retired**: GitHub Pages (`gh-pages.yml`) was the temporary deploy target before a domain existed. Removed once Cloudflare + the custom domain went live, to avoid two different live URLs for the same site.

## 11. Environment & secrets

- Never commit real secrets. Provide `.env.example` documenting required variables (form endpoint key, analytics token) once those integrations are chosen.
- Cloudflare deploys need no repo secrets — Cloudflare's own Git-connected build handles it (see §10). Repository secrets in GitHub are only for things GitHub Actions itself needs (currently none beyond the built-in `GITHUB_TOKEN`).

## 12. Getting started (once scaffolded)

```bash
npm install
cp .env.example .env      # fill in required keys
npm run dev                # http://localhost:4321
npm run build               # astro check && astro build
npm run format               # prettier --write
```

## 13. Visual QA workflow (Playwright)

`@playwright/test` is a devDependency (`tests/visual-audit.spec.ts`, `playwright.config.ts`). Use it before shipping any visual/CSS/layout change — `npm run format`/`astro check` catch syntax and type errors, but nothing else in the toolchain actually looks at the rendered page.

**Run it against a production build, never `astro dev`:**

```bash
npm run build && npx astro preview --background
npm run test:visual
npx astro preview stop
```

Why not dev: Astro's dev server transforms images on demand through a `/_image` endpoint backed by `sharp`, and in this environment that path is flaky under concurrent load — Playwright's parallel workers hitting several image variants at once can make the dev server lose its reference to `sharp` mid-session, after which _every_ image request 500s until the process is restarted (`astro dev stop` / `astro dev --background`). A production build pre-renders every image variant as a static file at build time, so `astro preview` never touches that code path at all. This class of bug is also why the suite includes a standing "no failed network requests or console errors" test — screenshots alone don't make a broken `<img>` obvious (it just renders blank or shows alt text).

**What the suite actually checks** (`tests/visual-audit.spec.ts`):

- Screenshots of light/dark × mobile/desktop to `test-results/screenshots/` — **read them**, a green run only proves the assertions hold, not that the page looks right.
- The hero's primary CTA button is fully within the initial viewport (first-glance viewport fit).
- Hero tagline computed color is identical in light and dark mode (catches the class of bug where an adaptive color token gets used on a permanently-dark decorative surface — see the `--color-ink` vs `--color-fg` comment in `global.css`).
- Favicon and apple-touch-icon links resolve.
- The floating WhatsApp button is visible without scrolling on every page.
- Zero failed network requests / console errors on page load.

When adding a new interactive/visual feature, add a targeted assertion here rather than only eyeballing a screenshot once — screenshots catch what you think to look at; a computed-style or bounding-box assertion catches the same regression next time without a human needing to notice it in a diff.

## 14. Open decisions to confirm with the client before/while building

- ~~Lead-capture channel(s)~~ — resolved: phone, WhatsApp, and email, sourced from the business-card assets in `src/images/branding/` and wired into `src/data/site.ts` as arrays (`contacts.phones`/`.whatsapp`/`.emails`), each with one `primary: true` entry, ready for more contacts later.
- **Still open**: trade license number/authority — a number is visible on one business card photo but not confidently legible; `site.license` still holds a TODO placeholder. Do not guess it — confirm with the client and update `src/data/site.ts`, then surface it in `Footer`/`about.astro`/`SEO.astro`'s `identifier` field (already wired to pick it up automatically once the TODO string is replaced).
- Exact list of service pages (is "Maintenance" a standalone service line with its own page, or folded into each service?).
- ~~Final domain name~~ — resolved: `earthconecontracting.com`, purchased through Cloudflare. `SITE_URL` in `astro.config.mjs` and all canonical/OG URLs already point at it.
- Whether to pursue dedicated per-Emirate landing pages now or defer until there's real project content per Emirate (see §4).
- A handful of `src/images/interiors/` files (`interior-design-reference-*.jpeg`, `office-interior-render-*.jpeg`) look like mood-board/render references rather than photos of completed Earth Cone work — currently excluded from the `/portfolio` grid by `src/lib/portfolioMedia.ts`'s `EXCLUDED_BASENAMES` list pending client confirmation either way.
- Portfolio photo quality varies — some source photos are dim, blurry, or read as work-in-progress site snapshots rather than polished finished-work shots. Worth a client review pass (or professional reshoot) before launch, since the portfolio is the site's main trust-building surface.
- **Asset filenames are not trustworthy — verify by looking at the photo before writing copy or alt text against it.** A spot-check of ~20 files found three wrong: two `electrical/floor-electrical-conduits-*` photos were actually large-format floor tiling (moved to `interiors/floor-tiling-*`), `construction-exteriors/foundation-construction-02` was a water-meter manifold (moved to `water-systems/water-meter-manifold-01`), and `villa-construction-03` is a phone screenshot with the gallery app's own UI baked in (excluded via `EXCLUDED_BASENAMES` pending a clean re-export from the client). The remaining ~180 files have not been reviewed one by one — assume more mislabels until they have.

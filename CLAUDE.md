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

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | [Astro 5](https://astro.build/) (static output) | Ships zero JS by default; ideal for a mostly-static marketing/lead-gen site; best-in-class Core Web Vitals |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first, small final CSS, fast iteration |
| Icons | `astro-icon` + an Iconify set (e.g. `@iconify-json/ph`) | Inlined SVG, no icon font |
| Images | `astro:assets` + `sharp` | Automatic AVIF/WebP + responsive `srcset` |
| Content | Astro Content Collections (MDX) | Type-safe service/project/testimonial entries |
| Routing | Astro View Transitions | SPA-like feel without a JS framework |
| Forms | Web3Forms (or equivalent) | No backend needed for a static site |
| Hosting | Cloudflare Pages | Free, fast edge network, matches sibling project |
| Language | TypeScript (strict) | Type-safe content schemas and utilities |
| Formatting | Prettier + `prettier-plugin-astro` | One canonical format, enforced in CI |

Do not introduce a second frontend framework (React/Vue/etc.) unless a specific interactive feature genuinely requires it — and then use an Astro island, not a full SPA rewrite.

## 3. Target architecture

The repo currently holds only raw media (`src/images/`) and docs. The Astro app should be scaffolded into this structure:

```
public/                 Static files served as-is (robots.txt, favicon, _headers)
src/
  assets/                Optimized source images for astro:assets (hero, og, branding)
  images/                Existing categorized media library (see docs/project-memory.md) — do not rename paths once referenced
  components/            One folder per component (Header, Footer, ServiceCard, ProjectGallery, ContactForm, SEO, ...)
  content/
    services/            One entry per service line (construction, interiors, kitchens, electrical, water-systems)
    projects/            Portfolio/case-study entries, tagged by service + emirate
    testimonials/
  data/
    site.ts              Business data: name, license info, phone, WhatsApp, emails, emirates served, socials
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    services/[slug].astro
    projects/[slug].astro       or  /portfolio/
    about.astro
    contact.astro
    service-areas.astro         Single page listing all emirates served (see SEO strategy — avoid thin per-city pages)
    404.astro
  styles/
    global.css            Design tokens (color, spacing, type scale), reset, shared component styles
  content.config.ts
docs/
  project-memory.md       Asset naming/organization log — keep maintaining per its own rules
```

Keep one component per directory with its `.astro` file; colocate component-specific styles inline (Tailwind) rather than separate CSS files unless truly shared.

## 4. SEO strategy

- **Structured data**: `GeneralContractor` (or `HomeAndConstructionBusiness`) JSON-LD on every page via a shared `<SEO>` component, including `areaServed` for all licensed Emirates. Add `Service` schema on service pages and `BreadcrumbList` site-wide.
- **Location strategy**: do not mass-generate thin "service in [city]" doorway pages with duplicate content — that gets penalized. Instead, ship one substantial, unique `/service-areas` (or `/locations`) page naming every Emirate served, and only build a dedicated location landing page for an Emirate once there is genuinely unique content (project photos, testimonials) to put on it.
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

| Category | Minimum score |
| --- | --- |
| Performance | 0.95 |
| Accessibility | 1.0 |
| Best Practices | 0.95 |
| SEO | 1.0 |

Rules to hit that budget:

- No render-blocking JS; interactivity is progressive enhancement only.
- All images through `astro:assets` (auto AVIF/WebP, explicit `width`/`height` to avoid CLS, `loading="lazy"` below the fold).
- **Video is currently a risk**: `src/images/` holds ~193 MB of raw WhatsApp-export MP4s (some 30–40 MB each) committed directly to git. Before using any of them on a page:
  1. Compress with `ffmpeg`/HandBrake (target ≤ 5 MB per clip, 720p, CRF ~28, `-movflags +faststart`).
  2. Serve from `public/videos/` (or an external host/CDN) with `preload="none"` or `poster` images, never autoplay a large file.
  3. Consider Git LFS for `public/videos/`, or hosting large source video outside the repo entirely — a git history full of 40 MB blobs makes clone/CI slow permanently, even if the files are later deleted.
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

- `main` is the production branch, deployed automatically to Cloudflare Pages. **`main` is protected: no direct pushes, all changes land via pull request.**
- Feature branches: `feature/<short-name>`, `fix/<short-name>`, `content/<short-name>`.
- Commit messages: concise, imperative mood, explain *why* not *what* (e.g. `Fix hero LCP by preloading hero image`, not `update code`).
- PRs use `.github/PULL_REQUEST_TEMPLATE.md` (add one mirroring the sibling project: summary, type of change, build/test checklist, screenshots for visual changes).
- Squash-merge PRs into `main` to keep history linear and readable.
- The GitHub ruleset enforced on `main` (configured at the repo/org level, not in code):
  - Require a pull request before merging.
  - Block force-pushes and branch deletion.
  - Require the CI status check to pass before merging (once `ci.yml` exists — see below).
  - See the repo's Settings → Rules → Rulesets for the live configuration.

## 10. CI/CD

Add these GitHub Actions workflows (mirroring the sibling project) once the app is scaffolded:

- `.github/workflows/ci.yml` — on PR to `main`: install, `astro check`, `astro build`, `prettier --check`. This is the required status check for the branch ruleset.
- `.github/workflows/lighthouse.yml` — on PR to `main`: build, run Lighthouse CI against the thresholds in §6.
- `.github/workflows/deploy.yml` — on push to `main`: build and deploy to Cloudflare Pages (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` repo secrets).

## 11. Environment & secrets

- Never commit real secrets. Provide `.env.example` documenting required variables (form endpoint key, analytics token, Cloudflare project name) once those integrations are chosen.
- Repository secrets (Cloudflare, form provider) are configured in GitHub repo settings, not in code.

## 12. Getting started (once scaffolded)

```bash
npm install
cp .env.example .env      # fill in required keys
npm run dev                # http://localhost:4321
npm run build               # astro check && astro build
npm run format               # prettier --write
```

## 13. Open decisions to confirm with the client before/while building

- Exact list of service pages (is "Maintenance" a standalone service line with its own page, or folded into each service?).
- Final domain name (update `site` in `astro.config.mjs` and all canonical/OG URLs once confirmed — do not invent one).
- Lead-capture channel(s): WhatsApp, form, phone — likely all three, mirrored from the sibling project's pattern.
- Whether to pursue dedicated per-Emirate landing pages now or defer until there's real project content per Emirate (see §4).

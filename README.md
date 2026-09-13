# Earth Cone

Website for **Earth Cone Building Contracting** — a construction and maintenance
contractor headquartered in Dubai, licensed to operate across all seven Emirates
of the UAE.

See [`CLAUDE.md`](CLAUDE.md) for the full architecture, conventions, SEO/performance
targets, and branch/PR workflow this project follows.

## Tech stack

Astro 5 (static) · Tailwind CSS v4 · TypeScript · Cloudflare (Git-connected deploy, custom domain).

## Getting started

```bash
npm install
cp .env.example .env   # add your Web3Forms key
npm run dev             # http://localhost:4321
```

| Command           | Action                                          |
| ------------------ | ------------------------------------------------ |
| `npm run dev`     | Start local dev server                            |
| `npm run build`   | Type-check (`astro check`) and build to `dist/`   |
| `npm run preview` | Preview the production build                      |
| `npm run format`  | Format source with Prettier                        |
| `npm run lint`    | Check formatting without writing                   |

## Project structure

```
public/            Static files served as-is (robots.txt, favicon, llms.txt)
src/
  components/      UI components, one folder per component
  content/services/ Service line entries (construction, interiors, kitchens, ...)
  data/site.ts     Business data — phone, email, license, emirates served
  images/          Categorized media library (see docs/project-memory.md)
  layouts/         BaseLayout.astro
  pages/           File-based routes
  styles/          global.css — design tokens, Tailwind theme
```

## License

MIT — see [LICENSE](LICENSE).

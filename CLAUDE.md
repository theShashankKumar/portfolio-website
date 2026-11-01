# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Portfolio project

A static personal portfolio site (theshashankkumar.com) for Shashank Kumar, Senior Product Designer. Plain HTML/CSS/JS at the repo root — no framework, no build step. The design direction is **"Sumi" (墨)**: ink-and-stone Japanese minimalism, with light and dark themes.

Working directory: `~/Desktop/Claude/portfolio`.

### Dev server

Served by `npx serve` on port 3456 (see `.claude/launch.json`). There is no `package.json` / npm script.

```bash
npx serve -l 3456
```

Then open http://localhost:3456.

### Structure

- `index.html` — the single-page landing. Sections: nav, hero, impact stats, "trusted by" logos, work (case studies → Behance), experience timeline, ventures, approach, beyond design, contact, footer.
- `v2.css` — all styles. Design tokens (colour, type, spacing, radius, motion) live in `:root` as the single source of truth; self-hosted `@font-face` declarations sit at the top.
- `v2.js` — behaviour: light/dark theme toggle, mobile menu, scroll-reveal, animated stat counters, the contact ensō draw, and smooth-scroll. All motion is guarded by `prefers-reduced-motion`.
- `vercel.json` — deploy config: clean URLs, immutable font caching, security headers, and a redirect from the old `/skeps-case-study` to `/`.
- `assets/brands/` — "trusted by" logos (SVGs plus the Deutsche Telekom JPG).
- `assets/fonts/` — self-hosted woff2 (Inter Tight, Inter, IBM Plex Mono).
- `assets/favicon.svg` — the ensō favicon.

### Key conventions

- **Fonts:** Inter Tight (display), Inter (body), IBM Plex Mono (mono labels/metrics), self-hosted with `font-display: swap`. No Google Fonts at runtime.
- **Theming:** tokens defined on `:root`; dark theme via `:root[data-theme="dark"]` and `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`. The toggle sets `data-theme` on `<html>`.
- **Scroll reveal:** elements with `.reveal` get the `.in` class once they enter the viewport (IntersectionObserver in `v2.js`); under reduced-motion they show immediately.
- **Japanese motif:** each section leans into a principle (ma / kanso / shibui / continuity / 道 / wabi-sabi) with a large low-opacity kanji ornament (`.kanji`, `aria-hidden`); the contact section has a hand-drawn ensō circle.
- **Content** is hardcoded in `index.html` (no data file). Case studies link out to Behance rather than to on-site pages.
- Accessibility: WCAG AA contrast, keyboard-navigable, self-hosted fonts. The site scores ~99 / 100 / 100 / 100 on Lighthouse (performance / accessibility / best-practices / SEO).

### Deploy

Hosted on **Vercel** (project `portfolio-website`), connected to the GitHub repo `theShashankKumar/portfolio-website`. Pushing to `main` auto-deploys to production, aliased to `www.theshashankkumar.com`. For a manual production deploy from the project folder:

```bash
npx vercel --prod
```

### No tests

There is no test suite. Manual browser verification (across light/dark themes and mobile/tablet/desktop widths) is the only testing path.

# Boost Mind v39 — Compact Services, Early Clients and BowTie Project

## Scope
- Removed the `06 / 06 / 01` Hero statistics strip (desktop + mobile)
- Removed the redundant scrolling list of capabilities and six oversized capability cards
- Replaced capability cards with an accessible, interactive six-choice Service Explorer. The right panel contains a relevant 3-step example, clear description and result; uses subtle CSS motion, no WebGL
- Mobile capability choices are horizontally swipeable, with the same detail panel and full-width layout
- Moved the existing, continuously scrolling Client Logos section to immediately follow `Built around your workflow` on desktop and mobile
- Restored the workflow statement on mobile so the Client Logos section can sit below it as requested
- Client logo marquee keeps the duplicated seamless loop, hover pause, mobile spacing, and reduced-motion fallback
- Added BowTie Risk Analysis to the Projects gallery and project modal
- Existing CHEIRON Executive HSE Dashboard project is retained and remains featured: this is the existing HSE Dashboard, not duplicated
- The BowTie image is a conceptual **illustrative preview**, not a screenshot of the real BowTie application. Replace `public/projects/bowtie-risk-analysis.webp` with a screenshot of the real system when available
- Kept all original project modals, Start Project form, Cloudflare Pages Worker, and performance setup
- Kept desktop-only C4D. No C4D loaded for mobile devices

## Files changed
- `index.html`: section order, project card, Service Explorer, remove stats and duplicate content
- `src/main.js`: dynamic service examples and BowTie modal metadata
- `src/style.css`: scoped v39 layout and CSS animation
- `public/projects/bowtie-risk-analysis.webp`: lightweight concept preview
- `README.md`, `package.json`, `build.mjs`

## QA
- JS syntax validated using Node
- CSS parsed using tinycss2 with no top-level syntax errors
- Inquiry tests and Cloudflare build passed
- HTML structure and local assets verified
- Browser screenshot validation was unavailable in this runtime (Chromium blocked navigation by admin policy); no unsupported claim of visual browser verification

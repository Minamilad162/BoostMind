# Boost Mind Technology — Custom Software Website v40

Premium bilingual-friendly corporate software-solutions website (English UI). Built as static HTML, CSS and JS, with Cloudflare Pages `_worker.js` for inquiries

## What changed in v40

- Removed Kemet and We Padel cards/assets
- Added Stop Card, Incident Investigation, Action Tracker, 3D Process Simulation, 3D Process Safety Management (LSR & PSF), Technica Consult LMS, retained BowTie and CHEIRON HSE Dashboard
- Kept MOC & Action Tracker, MCDC and Media Buyer projects, for a total of 11 project cards
- Replaced the old service menu with an accessible tailored software explorer showing four realistic scenarios, rules, screens and workflow examples
- Replaced generic orbit/process decoration with a five-stage interactive implementation blueprint
- Added problem-to-solution and client outcome sections, with stronger messaging around bespoke software
- Kept client logo marquee in its place immediately after Built around your workflow
- Preserved mobile scroll animations, the desktop C4D engine, and disabled C4D entirely on mobile
- No change to email notification/sending logic; existing Cloudflare environment variables are still required

## Local usage

```bash
npm run dev
npm run test:inquiry
npm run test:site
npm run build
npm run preview
```

Cloudflare Pages build command: `npm run build`, output directory: `dist`

See `MEDIA_REUSE_NOTE.md` for demo video handling and `CLOUDFLARE_EMAIL_SETUP.md` for required Cloudflare Email Service configuration

New project illustrations in `public/projects/*.svg` are original concept visuals, **not actual product screenshots**

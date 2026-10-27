# Boost Mind — Visual Identity Rebuild v13

This version is a full visual redesign. It keeps the project preview, Start a Project form, and Cloudflare email notification workflow, but replaces the previous visual identity and layout.

## Run locally
```powershell
npm run dev
```
Open http://localhost:5173

## Build for Cloudflare Pages
```powershell
npm run build
```
Upload the contents of `dist/`.

## Media policy
This update includes the lightweight project screenshots and client logos so the design previews correctly. Large project videos are not duplicated. If the videos from the full-media master are copied into `public/projects/` using the existing filenames, the project modal automatically detects them and shows a **Play product demo** button.

## Brand
The actual supplied Boost/BroadMind symbol is stored at `public/brand/boostmind-mark.webp` and is used throughout the site. The company name shown in the UI is **Boost Mind**.


## v17 color direction
See `V16_PALETTE.md`. The C4D animation is preserved; only the color system has been rebuilt.


## v19 — Contact & Email Reliability
- Added `info@boostmind-tech.com` to Contact, inquiry modal, and footer.
- Uses `info@boostmind-tech.com` as the default Cloudflare Email sender.
- Project inquiry notifications still go to `bishosamuel@gmail.com`.
- Reply-To is the client email.
- Added Email binding → REST API fallback.
- Added `/api/health` email diagnostics.
- Added `npm run test:inquiry` automated tests.

## v21 performance update
The Cinema 4D / WebGL layer is progressively loaded after first paint instead of blocking the page. Rendering is adaptive: lower DPR and FPS on mobile, tab-hidden pause, lighter geometry, lazy project/client images, and a lightweight branded fallback while WebGL initializes.


## v23 Performance Turbo
See `V23_PERFORMANCE_TURBO.md`.


## v24 performance
Adaptive WebGL scheduling, WebP assets, low-power rendering, modal pause, and reduced mobile effects.


## v25 — Simple Start Project
The inquiry form was reduced to name, email, phone/WhatsApp, project brief, and optional reference link. Frontend payload, Worker validation, and notification email were updated to match.


## v26
Humanized the visible copy and removed unnecessary sentence-ending dots across the website while preserving all v25 functionality


## v27 production email fix
Cloudflare Pages now sends project inquiry emails through the Cloudflare Email Service REST API. Add `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_EMAIL_API_TOKEN` to the production environment and redeploy. Check `/api/health` after deployment before testing the form.


## v29
- Removed the dark Clients panel background
- Integrated the logo marquee into the normal light site background
- Increased logo contrast and kept the automatic seamless slider
- Preserved pause/play control, mobile behavior, reduced-motion fallback and email flow


## v32
- Moved the Trusted Companies logo slider directly after the What we build section
- Updated navigation order to match the new page flow

## v33 — Mobile Redesign
The mobile UI (<=700px) was rebuilt to match the approved Boost Mind mobile concept while keeping desktop unchanged. Trusted Companies remains an automatic looping logo slider. See `V33_MOBILE_REDESIGN.md`.

## v34
- Mobile spacing repair removes duplicated C4D portal gaps
- Mobile C4D renderer uses lower resolution and steadier frame pacing
- C4D pauses behind the Clients logo marquee
- Process mobile visual uses a lightweight branded composition instead of an empty reserved block

# v40 — Tailored Software positioning

## Project coverage

1. CHEIRON Executive HSE Dashboard (existing, retained)
2. Stop Card · Safety Observations (new)
3. Incident Investigation (new)
4. Action Tracker (new, separate from MOC)
5. 3D Process Safety Management — Life-Saving Rules & Process Safety Fundamentals (new)
6. 3D Process Simulation (new)
7. Technica Consult LMS (new)
8. BowTie Risk Analysis (existing, retained)
9. MOC & Action Tracker (existing, retained)
10. Media Buyer Analytics Studio (existing, retained)
11. MCDC Academy Platform (existing, retained)

Kemet Perfume and We Padel removed from the site and unused media assets removed

## New narrative and experience

- Hero focuses on the client's workflow and requirements
- Business context selectors: Operations, HSE, Learning, Insights. The interactive preview shows workflows and configuration scope
- Problem cards describe real friction and the appropriate type of tailored solution
- Portfolio filter by business domain. Project popups reuse existing modal; new projects have illustrative concept previews pending approved screenshots
- Five practical stages of custom software delivery with an animated blueprint view and real deliverables
- Outcome section highlights owner clarity, connected records, relevant visibility and extensibility

## Technical guardrails

- Cloudflare email Worker and form fields unchanged
- No C4D loading or canvas on mobile
- Desktop WebGL engine retained in `public/assets/c4d-scroll-engine.js`
- Client logo marquee unchanged and keeps moving on both desktop and mobile
- New animations use only opacity/transforms and are disabled under reduced motion
- No fake outcomes, numerical claims, or project screenshots

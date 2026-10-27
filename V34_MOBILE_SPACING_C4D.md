# v34 — Mobile spacing + C4D performance

- Removed duplicate mobile C4D scene portals that were reserving large blank gaps before each section
- Tightened mobile vertical rhythm across Hero, Expertise, Clients, Work, Process and CTA
- Reduced the Hero visual reservation from 300px to 176px
- Replaced the empty Process 3D reservation with a compact CSS-only branded visual
- Lowered mobile WebGL render resolution for steadier frame pacing
- Changed low-power idle rendering from ~18 FPS to a steadier ~24 FPS target
- Reduced mobile particle count
- Added smooth touch-scene interpolation while preserving low-power scene internals
- Pauses C4D rendering while the Clients logo marquee is visible on mobile
- Desktop/tablet layout remains unchanged

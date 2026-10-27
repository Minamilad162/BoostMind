# Boost Mind v21 — Performance

- C4D engine no longer blocks initial page loading; it is loaded after first paint during browser idle time.
- First interaction can trigger C4D immediately.
- Save-Data, reduced-motion, and very slow connections keep a lightweight brand fallback.
- Mobile WebGL antialiasing disabled and renderer uses low-power preference.
- Device pixel ratio capped to 1.0 mobile / 1.35 desktop.
- C4D render rate capped to 30 FPS mobile / 45 FPS desktop.
- Rendering pauses while the browser tab is hidden.
- Project and client images are lazy-decoded / lazy-loaded.
- Brand mark reduced from 740px to 512px while preserving transparency.
- Favicon replaced by a compact 96px asset.
- Unused full-logo asset removed from the deploy package.

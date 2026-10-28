# v37 — Mobile C4D Removed

- C4D/WebGL is now desktop-only
- Mobile devices never load `c4d-scroll-engine.js`
- Critical inline CSS hides the C4D stage before first paint on mobile
- Mobile removes the stage from the DOM at runtime as an additional guard
- Desktop C4D behavior remains unchanged
- Mobile keeps only lightweight in-flow CSS visuals

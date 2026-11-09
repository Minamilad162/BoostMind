/*
 * v50: Keep original C4D engine on desktop only.
 * Mobile animates the original Boost Mind logo without WebGL.
 */
const root = document.documentElement;
const stage = document.getElementById('visual-stage');
const canvas = document.getElementById('webgl-canvas');
if (root.getAttribute('data-desktop-c4d') === '1' && stage && canvas) {
  let contextLost = false;
  root.classList.add('c4d-loading');
  stage.classList.add('c4d-loading');
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    contextLost = true;
    root.classList.remove('c4d-ready');
    root.classList.add('c4d-webgl-error');
    window.dispatchEvent(new Event('boostmind:c4d-pause'));
    console.error('[Boost Mind C4D] WebGL context lost');
  });
  try {
    await import('/assets/c4d-scroll-engine.js?v=50');
    if (contextLost) throw new Error('WebGL context was lost during initialization');
    stage.classList.remove('c4d-loading', 'c4d-fallback');
    stage.classList.add('c4d-ready');
    root.classList.remove('c4d-loading', 'c4d-webgl-error');
    root.classList.add('c4d-ready');
  } catch (error) {
    root.classList.remove('c4d-loading', 'c4d-ready');
    root.classList.add('c4d-webgl-error');
    stage.classList.remove('c4d-loading', 'c4d-ready');
    stage.classList.add('c4d-fallback');
    console.error('[Boost Mind C4D] Original scene failed to load:', error);
  }
}

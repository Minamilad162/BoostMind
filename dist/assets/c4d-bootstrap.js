/*
 * v48: independent loader for the ORIGINAL Boost Mind / C4D WebGL scene.
 * Does not add any replacement graphic, scene, model or alternate animation.
 */
const root = document.documentElement;
const stage = document.getElementById('visual-stage');
const canvas = document.getElementById('webgl-canvas');

if (root.getAttribute('data-desktop-c4d') === '1' && stage && canvas) {
  root.classList.add('c4d-loading');
  stage.classList.add('c4d-loading');
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    root.classList.remove('c4d-ready');
    root.classList.add('c4d-webgl-error');
    console.error('[Boost Mind C4D] WebGL context lost');
  });
  try {
    // Direct import starts on initial page load rather than a deferred idle timer.
    // Retain the unchanged original v39 engine and its scroll animation.
    await import('/assets/c4d-scroll-engine.js?v=48');
    stage.classList.remove('c4d-loading', 'c4d-fallback');
    stage.classList.add('c4d-ready');
    root.classList.remove('c4d-loading', 'c4d-webgl-error');
    root.classList.add('c4d-ready');
  } catch (error) {
    root.classList.remove('c4d-loading');
    root.classList.add('c4d-webgl-error');
    stage.classList.remove('c4d-loading');
    stage.classList.add('c4d-fallback');
    console.error('[Boost Mind C4D] Original scene failed to load:', error);
  }
}

/*
 * v49 — The ORIGINAL Boost Mind C4D scroll engine on desktop and mobile.
 * No newly designed 3D scene: only mobile viewport mounting/performance handling.
 */
const root = document.documentElement;
const stage = document.getElementById('visual-stage');
const canvas = document.getElementById('webgl-canvas');
const heroVisual = document.querySelector('#home .hero-visual');
const desktopC4D = root.getAttribute('data-desktop-c4d') === '1';
const mobileCandidate =
  root.getAttribute('data-mobile-ui') === '1' &&
  window.matchMedia('(max-width: 900px)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !navigator.connection?.saveData &&
  !((navigator.hardwareConcurrency || 8) <= 2 && (navigator.deviceMemory || 8) <= 2);

let mobileC4D = false;
if (mobileCandidate && stage && canvas && heroVisual) {
  try {
    // Three.js r185 requires WebGL2. Test it before hiding the existing fallback.
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2', {
      alpha: true, antialias: false, powerPreference: 'low-power'
    });
    if (gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      heroVisual.appendChild(stage);
      root.setAttribute('data-mobile-c4d', '1');
      mobileC4D = true;
    }
  } catch (error) {
    console.warn('[Boost Mind C4D] Mobile WebGL unsupported:', error);
  }
}

if ((desktopC4D || mobileC4D) && stage && canvas) {
  let contextLost = false;
  root.classList.add('c4d-loading');
  stage.classList.add('c4d-loading');
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    contextLost = true;
    root.classList.remove('c4d-ready', 'mobile-c4d-ready');
    root.classList.add('c4d-webgl-error');
    window.dispatchEvent(new Event('boostmind:c4d-pause'));
    console.error('[Boost Mind C4D] WebGL context lost');
  });
  try {
    // Same original geometry, logo and animations. A version bump only busts cache.
    await import('/assets/c4d-scroll-engine.js?v=49');
    if (contextLost) throw new Error('WebGL context was lost during initialization');
    stage.classList.remove('c4d-loading', 'c4d-fallback');
    stage.classList.add('c4d-ready');
    root.classList.remove('c4d-loading', 'c4d-webgl-error');
    root.classList.add('c4d-ready');
    if (mobileC4D) {
      root.classList.add('mobile-c4d-ready');
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
          const visible = entries.some(entry => entry.isIntersecting);
          if (!visible) {
            window.dispatchEvent(new Event('boostmind:c4d-pause'));
          } else if (!document.hidden && !document.querySelector('dialog[open]')) {
            window.dispatchEvent(new Event('boostmind:c4d-resume'));
          }
        }, { threshold: 0.02 });
        observer.observe(heroVisual);
        window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
      }
    }
  } catch (error) {
    root.classList.remove('c4d-loading', 'c4d-ready', 'mobile-c4d-ready');
    root.classList.add('c4d-webgl-error');
    stage.classList.remove('c4d-loading', 'c4d-ready');
    stage.classList.add('c4d-fallback');
    console.error('[Boost Mind C4D] Original scene failed to load:', error);
  }
}

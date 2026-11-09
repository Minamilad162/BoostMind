import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const html = await readFile(new URL('../index.html',import.meta.url),'utf8');
const js = await readFile(new URL('../src/main.js',import.meta.url),'utf8');
const css = await readFile(new URL('../src/style.css',import.meta.url),'utf8');
const ids=['cheiron','stopcard','incident','action','psm','simulation','severo','lms','bowtie'];
for (const id of ids){
 assert.ok(html.includes(`data-project="${id}"`), `Missing portfolio project ${id}`);
 assert.ok(js.includes(`${id}:`), `Missing modal description for ${id}`);
}
assert.equal((html.match(/class="project project-custom/g)||[]).length, 12);
assert.ok(!/data-project="(?:kemit|padel)"/.test(html));
assert.ok(!/(?:Kemit Perfume|We Padel)/.test(js));
assert.ok(html.indexOf('class="statement strip"')<html.indexOf('id="clients"'));
assert.ok(html.indexOf('id="clients"')<html.indexOf('id="expertise"'));
assert.ok(html.includes('id="tailor-explorer"')&&html.includes('id="approach-preview"'));
assert.ok(html.includes('class="portfolio-filters"'));
assert.ok(css.includes('prefers-reduced-motion:reduce'));
assert.ok(!html.includes('06 Projects')&&!html.includes('01 / CAPABILITIES'));
assert.ok(js.includes('if(!desktopC4DEnabled)'));
for(const file of ['stop-card.svg','incident-investigation.svg','action-tracker.svg','technica-lms.svg','3d-process-safety.svg','3d-process-simulation.svg']){
 const contents=await readFile(new URL(`../public/projects/${file}`,import.meta.url),'utf8');
 assert.ok(contents.startsWith('<svg'));
}

for(const project of ['stop-card','action-tracker','3d-process-simulation','severo-spatial','bowtie-risk-analysis']){
 for(const suffix of ['.webp','-card.webp']){
  const meta=await stat(new URL(`../public/projects/${project}${suffix}`,import.meta.url));
  assert.ok(meta.size>5_000,`Real preview missing for ${project}${suffix}`);
 }
}
assert.ok(html.includes('class="friction-visual"'));
assert.ok(js.includes('has-wide-preview'));
assert.ok(css.includes('.project-modal.has-wide-preview .modal-media'));
assert.ok(html.includes('data-project="severo"'));
assert.ok(html.includes('src="/projects/stop-card-card.webp"'));
assert.ok(html.includes('src="/projects/bowtie-risk-analysis-card.webp"'));
console.log('Site coverage: PASS — all 8 requested projects, 12 cards, no Kemet/Padel, no mobile C4D');


// v42: animation must be progressive, accessible, lightweight and non-destructive.
assert.ok(html.includes('class="friction-workflow"'));
assert.ok(html.includes('class="workflow-wires"'));
for(const label of ['Requests','Data','Team input','class="workflow-core-title"','Clearer workflows','Connected visibility']) assert.ok(html.includes(label));
assert.equal((html.match(/class="friction-card"/g)||[]).length,3);
assert.ok(js.includes("workflowObserver.observe(workflowGraphic)"));
assert.ok(css.includes('.friction-workflow.is-in-view .workflow-wire-flow'));
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));


// v43: card + both words animate continuously (not dependent on visibility or hover).
assert.ok(html.includes('<span class="workflow-title-line">Custom</span>'));
assert.ok(html.includes('<span class="workflow-title-line">Solution</span>'));
assert.ok(css.includes('.workflow-core .workflow-title-line{'));
assert.ok(css.includes('animation:bm-v43-core-float 5.4s'));
assert.ok(css.includes('animation:bm-v43-title-shimmer 5.6s'));
assert.ok(css.includes('.workflow-core-orbit{animation:bm-workflow-halo'));
assert.ok(css.includes('.workflow-core-mark{animation:bm-workflow-mark'));
assert.ok(!css.includes('.friction-workflow.is-in-view .workflow-core-orbit{animation:'));
assert.ok(!css.includes('.friction-workflow.is-in-view .workflow-core-mark{animation:'));
assert.ok(css.includes('-webkit-text-fill-color:#fff!important'));



// v44: orbital architecture studio with five working stages, auto-tour and manual control.
for(const label of ['ARCHITECTURE IN MOTION','approach-lab-scene','lab-ring-outer','lab-core','approach-core-title','approach-play-toggle']) assert.ok(html.includes(label));
assert.ok(!html.includes('class="approach-blueprint"'));
assert.ok(js.includes('const approachLoopMs=6800'));
assert.ok(js.includes("approachButtons.forEach(button=>button.addEventListener('click'"));
assert.ok(js.includes("approachAutoplayEnabled=false"));
assert.ok(js.includes("approachPreview.dataset.activePhase=key"));
assert.ok(js.includes('IntersectionObserver'));
assert.ok(css.includes('@keyframes bm44-orbit-outer'));
assert.ok(css.includes('@keyframes bm44-module-enter'));
assert.ok(css.includes('.approach-preview.is-in-view .lab-ring-outer'));
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
assert.equal((html.match(/class="approach-step(?: is-active)?"/g)||[]).length,5);


// v45: dynamic desktop alignment + compact responsive scene retain v44 features.
assert.ok(js.includes("const syncApproachPanelHeight="));
assert.ok(js.includes("approachPreview.style.setProperty('--approach-peer-height'"));
assert.ok(css.includes('height:var(--approach-peer-height,380px)'));
assert.ok(css.includes('@media(max-width:1100px)'));
assert.ok(css.includes('.approach-lab-scene{height:218px}'));
assert.ok(html.includes('LIVE DESIGN STUDIO'));
assert.ok(js.includes('approachAutoplayEnabled=!motionReduced'));
assert.ok(css.includes('@keyframes bm44-orbit-outer'));

// v47 regression checks: use the original C4D scene, never a new graphic.
assert.equal((html.match(/id="visual-stage"/g)||[]).length,1);
assert.equal((html.match(/id="webgl-canvas"/g)||[]).length,1);
assert.ok(html.indexOf('id="visual-stage"')>html.indexOf('<section class="hero panel"'));
assert.ok(html.indexOf('id="visual-stage"')<html.indexOf('<div class="hero-copy">'));
assert.ok(!html.includes('desktop-c4d-fallback')&&!css.includes('.desktop-c4d-fallback'));
assert.ok(css.includes('html[data-desktop-c4d="1"] #home #visual-stage'));
assert.ok(!js.includes("import('/assets/c4d-scroll-engine.js?v=37')"));
assert.ok(html.includes('/src/style.css?v=49')&&html.includes('/src/main.js?v=49'));

// v48: the ORIGINAL minified C4D scene loads directly and independently
// from the main UI script. There must never be a replacement illustration.
const boot = await readFile(new URL('../public/assets/c4d-bootstrap.js',import.meta.url),'utf8');
assert.ok(html.includes('/assets/c4d-bootstrap.js?v=49'));
assert.ok(html.includes('/src/style.css?v=49')&&html.includes('/src/main.js?v=49'));
assert.ok(boot.includes("await import('/assets/c4d-scroll-engine.js?v=49')"));
assert.ok(!js.includes("import('/assets/c4d-scroll-engine.js?v=37')"));
assert.ok(boot.includes('c4d-webgl-error'));
assert.ok(!html.includes('desktop-c4d-fallback')&&!css.includes('.desktop-c4d-fallback'));
assert.ok(css.includes('html[data-desktop-c4d="1"] #home #webgl-canvas'));

// v49: exact original scene (not a recreated picture) works on mobile WebGL2.
const engine = await readFile(new URL('../public/assets/c4d-scroll-engine.js', import.meta.url),'utf8');
assert.ok(engine.includes('Stage_01_Boost Mind_Core'));
assert.ok(engine.includes('data-mobile-c4d'));
assert.ok(!js.includes("document.getElementById('visual-stage')?.remove()"));
assert.ok(boot.includes('heroVisual.appendChild(stage)'));
assert.ok(boot.includes("probe.getContext('webgl2'"));
assert.ok(boot.includes("root.classList.add('mobile-c4d-ready')"));
assert.ok(boot.includes('IntersectionObserver'));
assert.ok(css.includes('html[data-mobile-c4d="1"] #home .hero-visual > #visual-stage'));
assert.ok(css.includes('html[data-mobile-c4d="1"].c4d-webgl-error'));
assert.ok(!html.includes('desktop-c4d-fallback'));

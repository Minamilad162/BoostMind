import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const html = await readFile(new URL('../index.html',import.meta.url),'utf8');
const js = await readFile(new URL('../src/main.js',import.meta.url),'utf8');
const css = await readFile(new URL('../src/style.css',import.meta.url),'utf8');
const ids=['cheiron','stopcard','incident','action','psm','simulation','lms','bowtie'];
for (const id of ids){
 assert.ok(html.includes(`data-project="${id}"`), `Missing portfolio project ${id}`);
 assert.ok(js.includes(`${id}:`), `Missing modal description for ${id}`);
}
assert.equal((html.match(/class="project project-custom/g)||[]).length, 11);
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
console.log('Site coverage: PASS — all 8 requested projects, 11 cards, no Kemet/Padel, no mobile C4D');

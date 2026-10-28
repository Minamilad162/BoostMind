import { rm, mkdir, cp, copyFile } from 'node:fs/promises';
const dist = new URL('./dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await copyFile(new URL('./index.html', import.meta.url), new URL('./dist/index.html', import.meta.url));
await cp(new URL('./src/', import.meta.url), new URL('./dist/src/', import.meta.url), { recursive: true });
await cp(new URL('./public/', import.meta.url), dist, { recursive: true });
console.log('Boost Mind v36 Cloudflare build created in dist/');

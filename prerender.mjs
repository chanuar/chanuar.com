import { readFile, writeFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';

const vite = await createServer({
  mode: 'production',
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
});

try {
  const { renderDocument } = await vite.ssrLoadModule('/src/app/prerender.tsx');
  for (const [file, path] of [
    ['index.html', '/'],
    ['en.html', '/en'],
    ['404.html', '/404.html'],
  ]) {
    const template = new JSDOM(await readFile(`dist/${file}`, 'utf8'));
    const rendered = new JSDOM(await renderDocument(path));
    for (const asset of template.window.document.querySelectorAll(
      'script[src], link[rel="stylesheet"], link[rel="modulepreload"]',
    )) {
      rendered.window.document.head.appendChild(asset);
    }
    await writeFile(`dist/${file}`, rendered.serialize());
    template.window.close();
    rendered.window.close();
  }
} finally {
  await vite.close();
}

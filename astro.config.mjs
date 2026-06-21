// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';
import path from 'node:path';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

/**
 * 본문(prose) 안의 상대 `.md` 링크를 사이트 라우트로 변환한다.
 * 예) content/work/healthcare-mso.md 안의 `../services/regle.md` → `/services/regle`
 * GitHub 가독성을 위해 마크다운 원본의 `.md` 링크는 그대로 유지된다.
 */
function rehypeRelativeMdLinks() {
  return (/** @type {any} */ tree, /** @type {any} */ file) => {
    const srcPath = file?.path || file?.history?.[0];
    const srcDir = srcPath ? path.relative(CONTENT_ROOT, path.dirname(srcPath)) : '';
    const base = srcDir.split(path.sep).join('/');

    const walk = (/** @type {any} */ node) => {
      if (
        node.type === 'element' &&
        node.tagName === 'a' &&
        node.properties &&
        typeof node.properties.href === 'string'
      ) {
        const href = node.properties.href;
        if (href.endsWith('.md') && !/^(https?:|mailto:|#|\/)/.test(href)) {
          const joined = base ? `${base}/${href}` : href;
          const resolved = path.posix.normalize(joined).replace(/\.md$/, '');
          node.properties.href = '/' + resolved.replace(/^\/+/, '');
        }
      }
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };
    walk(tree);
  };
}

// Keystatic 어드민은 개발/로컬에서만 필요하다. 배포(정적 빌드) 시에는
// ASTRO_KEYSTATIC=0 으로 비활성화해 순수 정적 사이트(dist/)를 만든다.
const enableKeystatic = process.env.ASTRO_KEYSTATIC !== '0';

// https://astro.build/config
export default defineConfig({
  site: 'https://shingoon.com',
  integrations: [
    mdx(),
    react(),
    ...(enableKeystatic ? [keystatic()] : []),
    sitemap(),
  ],
  ...(enableKeystatic ? { adapter: node({ mode: 'standalone' }) } : {}),
  markdown: {
    rehypePlugins: [rehypeRelativeMdLinks],
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});

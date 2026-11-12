import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

/** Opens links to other sites in a new tab. Links within Pattern Life stay in the same tab. */
const externalLinksPlugin = () => ({
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      if (/^https?:\/\//.test(String(node.properties?.href ?? ''))) {
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', 'noopener noreferrer');
      }
    },
  },
});

export default defineConfig({
  // Published on GitHub Pages at https://supertyp.github.io/pattern-life/
  site: 'https://supertyp.github.io',
  base: '/pattern-life',
  trailingSlash: 'always',
  markdown: {
    processor: satteri({ hastPlugins: [externalLinksPlugin] }),
  },
});

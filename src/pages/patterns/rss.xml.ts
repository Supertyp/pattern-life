import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPatterns } from '../../lib/patterns';
import { url } from '../../lib/url';

export async function GET(context: APIContext) {
  const patterns = await getPatterns();
  return rss({
    title: 'Pattern Life — patterns',
    description: 'New practical patterns for everyday life',
    site: context.site!,
    items: patterns
      .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf())
      .map((p) => ({
        title: p.data.title,
        description: p.data.problem,
        pubDate: p.data.published,
        link: url(`/patterns/${p.id}/`),
      })),
  });
}

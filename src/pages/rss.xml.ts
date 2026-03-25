import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const sprint = await getCollection('sprint');
  const workbench = await getCollection('workbench');
  const paddock = await getCollection('paddock');

  const allPosts = [
    ...sprint.map(p => ({ ...p, section: 'sprint' })),
    ...workbench.map(p => ({ ...p, section: 'workbench' })),
    ...paddock.map(p => ({ ...p, section: 'paddock' })),
  ].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Genuine Geek Media',
    description: 'Silicon & Steel — Tech, motorsport, and geek culture from the GGM podcast.',
    site: context.site!,
    items: allPosts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/${post.section}/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}

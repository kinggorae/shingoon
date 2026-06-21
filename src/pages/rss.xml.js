import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  return rss({
    title: '신군닷컴 — 블로그',
    description: '신군(Ryan Shin)이 기록하는 일과 생각. AI 검색·커머스·해외 진출.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.publishDate,
      link: `/blog/${p.id}/`,
      categories: p.data.tags,
    })),
    customData: `<language>ko-KR</language>`,
  });
}

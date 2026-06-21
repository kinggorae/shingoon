import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 기록 문서들의 공통 프런트매터 — 전부 선택적으로 두어 유연하게 수용
const recordSchema = z.object({
  title: z.string(),
  summary: z.string().optional(),
  date: z.coerce.date().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  founded: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  sources: z.array(z.string()).optional(),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content' }),
  schema: recordSchema,
});

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/work' }),
  schema: recordSchema,
});

// 블로그 글 — GEO/SEO 최적화를 위한 구조화 필드 포함
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(), // 메타 설명 (검색·AI 답변 노출 핵심)
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('신현규 (Ryan Shin)'),
    tags: z.array(z.string()).default([]),
    tldr: z.array(z.string()).default([]), // 핵심 요약 (GEO 친화)
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/services' }),
  schema: recordSchema,
});

const companies = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/companies' }),
  schema: recordSchema,
});

const trips = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/trips' }),
  schema: recordSchema,
});

const journey = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/journey' }),
  schema: recordSchema,
});

export const collections = { pages, work, services, companies, posts, trips, journey };

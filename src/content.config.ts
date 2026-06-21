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

export const collections = { pages, work, services, companies, trips, journey };

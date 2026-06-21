// 블로그 카테고리 — Keystatic의 select 옵션과 동일하게 유지
export const CATEGORIES: Record<string, string> = {
  'ai-geo': 'AI·GEO',
  commerce: '커머스·브랜드',
  global: '해외·수출',
  healthcare: '병원·의료',
  log: '회고·기록',
};

export const categoryLabel = (value?: string | null): string =>
  (value && CATEGORIES[value]) || '기타';

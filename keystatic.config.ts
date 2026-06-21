import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: '신군닷컴' },
  },
  collections: {
    posts: collection({
      label: '글 (Blog)',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'publishDate'],
      schema: {
        title: fields.slug({
          name: {
            label: '제목',
            description: 'AI·검색에 그대로 노출되는 핵심. 질문형·구체형 제목을 권장합니다.',
          },
        }),
        description: fields.text({
          label: '메타 설명 (SEO·GEO)',
          description: '검색 결과와 AI 답변 미리보기에 쓰입니다. 한 문장으로 핵심을 — 120~160자 권장.',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        category: fields.select({
          label: '카테고리',
          description: '글의 분류. 블로그에서 카테고리별로 묶입니다.',
          options: [
            { label: 'AI·GEO', value: 'ai-geo' },
            { label: '커머스·브랜드', value: 'commerce' },
            { label: '해외·수출', value: 'global' },
            { label: '병원·의료', value: 'healthcare' },
            { label: '회고·기록', value: 'log' },
          ],
          defaultValue: 'ai-geo',
        }),
        cover: fields.image({
          label: '커버 이미지 (선택)',
          description: '글 상단과 공유(OG) 미리보기에 쓰입니다. 권장 1200×630.',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),
        publishDate: fields.date({ label: '발행일', validation: { isRequired: true } }),
        updatedDate: fields.date({ label: '수정일 (선택)' }),
        author: fields.text({ label: '저자', defaultValue: '신현규 (Ryan Shin)' }),
        tags: fields.array(fields.text({ label: '태그' }), {
          label: '태그 (키워드)',
          itemLabel: (props) => props.value,
        }),
        tldr: fields.array(fields.text({ label: '요약 항목', multiline: true }), {
          label: '핵심 요약 (TL;DR)',
          description: 'AI가 그대로 인용하기 좋은 1~3줄 요약. GEO 노출에 중요합니다.',
          itemLabel: (props) => props.value,
        }),
        faqs: fields.array(
          fields.object({
            question: fields.text({ label: '질문' }),
            answer: fields.text({ label: '답변', multiline: true }),
          }),
          {
            label: 'FAQ (AI 답변 인용 최적화)',
            description: '보호자·고객이 실제로 묻는 질문과 답. FAQPage 스키마로 자동 발행됩니다.',
            itemLabel: (props) => props.fields.question.value,
          }
        ),
        draft: fields.checkbox({ label: '초안 (체크하면 발행하지 않음)' }),
        content: fields.mdx({
          label: '본문',
          description: '명확한 H2/H3 구조로 — 질문에 바로 답하는 문단을 권장합니다.',
        }),
      },
    }),
  },
});

# 신군닷컴 (shingoon.com)

> 그동안 살아오며 했던 일들과, 지금 하고 있는 일들을 기록하는 개인 웹사이트.

베트남·중국 출장, 새로운 서비스 런칭 등 — 신군(Ryan Shin)의 일과 여정을 한 곳에 모아 기록합니다.

## 🎯 목표

- 지난 커리어와 삶의 기록을 정리해 아카이브로 남긴다
- 현재 진행 중인 일(출장, 서비스 런칭 등)을 꾸준히 기록한다
- WordPress 대신 직접 코드로 빠르고 가볍게 운영한다

## 🛠️ 기술 스택

- **[Astro](https://astro.build)** — 마크다운 기록을 정적 사이트로 발행 (content collections)
- **Pretendard** 폰트, 다크 테크 디자인 시스템 (의존성 최소)

### 로컬 실행

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ 빌드
```

### ✍️ 글쓰기 — 어드민 (Keystatic)

`npm run dev` 후 **http://localhost:4321/keystatic** 접속 → 글을 쓰면 `content/posts/`에 마크다운으로 저장됩니다.

- GEO/SEO 구조 필드: 메타 설명 · 핵심 요약(TL;DR) · FAQ · 태그
- 발행 시 글 페이지에 **JSON-LD(Article·FAQPage·Breadcrumb)**, 메타/OG, 목차, FAQ 아코디언, sitemap·RSS가 자동 적용 → AI 답변엔진·검색 노출 최적화
- 현재 로컬 모드(파일시스템). 배포 후 어디서나 편집하려면 Keystatic GitHub 모드로 전환 예정.

## 📁 구조

```
shingoon/
├── content/              # 기록 콘텐츠 (마크다운) — 사이트의 원천이자 GitHub 아카이브
│   ├── about.md          #   신군 프로필
│   ├── overview.md       #   현재 활동 개요
│   ├── companies/        #   회사 (서울벤처스, 사이공벤처스)
│   ├── services/         #   서비스 (리글, VetManAI, GeoDoc, SKYLIVING …)
│   ├── trips/            #   출장 기록 (베트남, 중국 등) — 예정
│   └── journey/          #   지난 여정 — 커리어·삶의 기록 — 예정
├── src/                  # Astro 사이트 (레이아웃·페이지·컴포넌트·스타일)
└── public/               # 정적 자산 (favicon 등)
```

## 📌 도메인

[shingoon.com](https://shingoon.com)

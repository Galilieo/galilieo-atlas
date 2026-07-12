# Galilieo 首页 P0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Do not spawn subagents unless the user explicitly authorizes parallel work. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在保留现有 Astro 内容、SEO、项目详情和文章详情的前提下，把当前部分完成的首页整理为已确认的日间 / 夜间 Heart Island 双主题作品集首页，并形成唯一、可验证、可继续迭代的 P0 实现。

**Architecture:** Astro 在构建阶段读取 `siteConfig`、项目 Collection 和博客 Collection，输出完整 HTML。首页按 Hero、Quick Overview、Featured Projects、Latest Blog、Archive Preview、About Preview 组装；客户端脚本只负责主题、菜单、Reveal 和轻量岛屿响应。P0 不引入 Vue、Three.js、Pagefind、CMS 或新依赖。

**Tech Stack:** Astro 7、TypeScript、Astro Content Collections、Markdown/MDX、原生 CSS、SVG、少量原生浏览器 TypeScript。

---

## 0. 执行约束

实施前必须阅读：

- `AGENTS.md`
- `docs/homepage-redesign.md`
- `docs/design-guide.md`
- `.agents/skills/portfolio-ui-change/SKILL.md`
- `.agents/skills/pre-release-check/SKILL.md`

执行规则：

- 不执行 `git reset`、`git checkout --`、`git clean` 或其他覆盖当前工作区的命令。
- 不自动提交、推送、创建 PR 或部署；每个任务以“检查点”代替 commit。
- 不修改博客正文、项目正文、Content schema、域名、Nginx 或依赖版本。
- 不引入 Vue、React、Svelte、Tailwind、Three.js、GSAP、Pagefind 或新包。
- 不把参考图中的天气、时间、音乐、GitHub 热力图、头像、虚构项目或虚构统计写入页面。
- `docs/assets/homepage-day-reference.png` 与 `docs/assets/homepage-night-reference.png` 仅是视觉原型和 UI 方向确认图；不得从 `src/` 导入、复制、裁切或作为网站背景。
- XingHuiSama 日间 / 夜间桌面截图与移动端截图只用于辅助研究背景、遮罩、玻璃面板、主题氛围和单列降级；优先级低于 Galilieo 高保真原型，不复制其代码、素材、功能、精确色值或技术栈。
- P0 主场景使用 CSS 渐变、现有 `IslandArtwork` 和统一占位；未来真实背景只替换 `HeroVisual` 的资源层，不改变 DOM、组件职责或首页顺序。
- 不从头重做已经存在的 `StatsBar`、`FeaturedProjects`、`LatestPosts`、`AboutPreview`；先复用，再收敛。
- 任一任务发现文件与计划不一致时先停止，更新本计划或向用户报告，不用临时补丁改变方向。

## 1. 目标文件结构

P0 完成后，首页相关文件应收敛为：

```text
src/
├── components/
│   ├── home/
│   │   ├── AboutPreview.astro
│   │   ├── ArchivePreview.astro
│   │   ├── FeaturedProjects.astro
│   │   ├── HeroSection.astro
│   │   ├── HeroSidePanel.astro
│   │   ├── HeroVisual.astro
│   │   ├── IslandArtwork.astro
│   │   ├── LatestPosts.astro
│   │   ├── QuickCards.astro
│   │   ├── QuickOverview.astro
│   │   └── StatsBar.astro
│   └── layout/
│       ├── MobileNavigation.astro
│       ├── SiteFooter.astro
│       └── SiteHeader.astro
├── config/
│   └── site.ts
├── data/
│   └── home.ts
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── archive/index.astro
│   ├── blog/index.astro
│   ├── notes/index.astro
│   └── notes/[...slug].astro
├── scripts/
│   ├── island-effects.ts
│   ├── main.ts
│   ├── navigation.ts
│   ├── reveal.ts
│   └── theme.ts
└── styles/
    ├── home/
    │   ├── base.css
    │   ├── hero.css
    │   ├── responsive.css
    │   └── sections.css
    ├── animations.css
    ├── content.css
    ├── global.css
    ├── reset.css
    ├── tokens.css
    ├── typography.css
    └── utilities.css
```

以下旧首页组件只有在新首页完成浏览器验收后才能删除：

```text
src/components/home/ContactSection.astro
src/components/home/CurrentlyExploring.astro
src/components/home/ExperiencePreview.astro
src/components/home/ExperienceSection.astro
src/components/home/FeaturedProject.astro
src/components/home/NotesSection.astro
src/components/home/ProjectsSection.astro
src/components/home/StackSection.astro
src/components/home/StatusStrip.astro
```

保留 `AboutSection.astro`，因为 `/about/` 正在使用。保留 `IslandArtwork.astro`，作为 P0 中央主视觉的 SVG 来源。

## 2. 页面与数据契约

首页顶层顺序固定为：

```text
SiteHeader
HeroSection
QuickOverview
FeaturedProjects
LatestPosts
ArchivePreview
AboutPreview
SiteFooter
```

对应 DOM id 固定为：

```text
#top
#quick-status
#projects
#blog
#archive-preview
#about
```

数据来源固定为：

| 内容                                     | 唯一来源                                           |
| ---------------------------------------- | -------------------------------------------------- |
| 品牌名称、SEO、作者、导航、联系方式      | `src/config/site.ts`                               |
| Hero 摘要、当前探索、实习摘要、成长轨迹  | `src/data/home.ts`                                 |
| 项目数、精选项目、项目状态               | `projects` Content Collection                      |
| 公开文章数、最新文章、归档预览、热门标签 | `blog` Content Collection 中 `draft: false` 的条目 |
| 中央岛屿主体                             | `src/components/home/IslandArtwork.astro`          |

项目与公开文章不足原型数量时按真实数量展示，不补假数据。

路由契约：`/blog/` 是新的主文章列表入口，`/notes/{id}/` 继续作为唯一文章详情 URL；`/notes/` 在 P0 保留兼容，不新增第二套详情路由，也不在未验证 Astro 静态重定向行为时临时改成重定向。

---

### Task 1: 建立 P0 静态验收脚本并锁定品牌名称

> 执行记录（2026-07-11）：本轮开始时 Task 1 的脚本、验证接线和品牌替换已存在于当前工作区。为避免回滚已有 P0 实现，没有重放 Step 2 的失败态；改为核对目标文件，并重新运行 build、`check:home` 和完整 verify。目标 diff 中已有的 Hero 三栏等结构调整早于本轮，不计入 Task 1 修改范围。

**Files:**

- Create: `scripts/check-home-structure.mjs`
- Modify: `package.json`
- Modify: `scripts/verify.mjs`
- Modify: `src/config/site.ts`
- Modify: `src/components/home/HeroSection.astro`
- Modify: `src/components/home/AboutPreview.astro`
- Modify: `src/components/layout/SiteFooter.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/archive/index.astro`

- [x] **Step 1: 新建只检查品牌的失败脚本**

创建 `scripts/check-home-structure.mjs`：

```js
/* global console, process */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distRoot = resolve(process.cwd(), 'dist');
const homepage = readFileSync(resolve(distRoot, 'index.html'), 'utf8');
const generatedPages = [
  resolve(distRoot, 'index.html'),
  resolve(distRoot, 'blog', 'index.html'),
  resolve(distRoot, 'archive', 'index.html'),
  resolve(distRoot, 'about', 'index.html'),
].map((file) => readFileSync(file, 'utf8'));

const failures = [];

if (!homepage.includes('Galilieo')) failures.push('Homepage must render the Galilieo brand.');
if (generatedPages.some((html) => html.includes('Davis Leo'))) {
  failures.push('Generated public pages must not contain Davis Leo.');
}

if (failures.length > 0) {
  failures.forEach((failure) => console.error(`FAIL: ${failure}`));
  process.exit(1);
}

console.log('Homepage identity checks passed.');
```

- [x] **Step 2: 运行构建和脚本，确认它因 Davis Leo 失败（既有实现，失败态不重放）**

Run:

```bash
pnpm run build
node scripts/check-home-structure.mjs
```

Expected: build 成功；第二条命令非零退出，并至少打印 `Generated public pages must not contain Davis Leo.`。

- [x] **Step 3: 在 `package.json` 注册脚本**

在 `scripts` 中加入：

```json
"check:home": "node scripts/check-home-structure.mjs"
```

- [x] **Step 4: 把主页检查接到统一验证的 build 之后**

将 `scripts/verify.mjs` 的 `checks` 改为：

```js
const checks = [
  { name: 'ESLint', script: 'lint' },
  { name: 'Astro check', script: 'check' },
  { name: 'Astro build', script: 'build' },
  { name: 'Homepage structure', script: 'check:home' },
];
```

- [x] **Step 5: 统一公开身份为 Galilieo**

将 `src/config/site.ts` 中相关值统一为：

```ts
name: 'Galilieo',
title: 'Galilieo — Portfolio & Notes',
description: 'Galilieo 的个人作品集与技术博客，记录 AI 应用开发、真实项目、实习经历和持续学习。',
author: {
  name: 'Galilieo',
  location: 'Shanghai, China',
  role: 'AI 应用开发者 / 软件工程学生',
},
```

同时完成以下机械替换：

- `HeroSection.astro` 的可见姓名改为从 `siteConfig.name` 读取。
- `AboutPreview.astro` 的姓名立即改为读取 `{siteConfig.name}`，不保留第二处品牌常量。
- `SiteFooter.astro` 注释不再写 Davis Leo；可见名称继续读取 `siteConfig.name`。
- `/blog/` 与 `/archive/` 的 title 改为 `博客 — Galilieo`、`归档 — Galilieo`。

- [x] **Step 6: 运行身份检查**

Run:

```bash
pnpm run build
pnpm run check:home
```

Expected: 输出 `Homepage identity checks passed.`。

- [x] **Step 7: 检查点**

Run:

```bash
git diff -- src/config/site.ts src/components/home/HeroSection.astro src/components/home/AboutPreview.astro src/components/layout/SiteFooter.astro src/pages/blog/index.astro src/pages/archive/index.astro scripts/check-home-structure.mjs scripts/verify.mjs package.json
```

确认只包含身份统一和验收脚本；不要提交。

---

### Task 2: 建立唯一首页静态数据源

> 执行记录（2026-07-11）：本轮开始时 `src/data/home.ts` 与 Hero 数据接入已存在，并已被 Hero 侧栏、快捷卡和 About 摘要复用。本轮核对事实与消费链路，并同步修正 `docs/content-guide.md` 中仍指向旧首页组件的维护入口。

**Files:**

- Create: `src/data/home.ts`
- Modify: `src/components/home/HeroSection.astro`

- [x] **Step 1: 创建 `src/data/home.ts`**

使用以下完整结构；不要添加无法验证的数字或成果：

```ts
export const homeProfile = {
  role: 'AI 应用开发者 / 软件工程学生',
  summary:
    '专注 AI 应用、Agent、RAG 与全栈产品实践。目前正在通过真实实习与个人项目，持续构建可落地的 AI 产品能力。',
  currentExploration: ['AI Agent', 'RAG', 'AI 产品工程化'],
  currentExperience: {
    title: 'AI 产品开发实习',
    period: '2026.06 — 至今',
    summary: '参与跨平台 AI 聊天产品的前端与移动端开发。',
  },
  currentStatus: '持续完善 Galilieo Portfolio 与 heart-island 心屿',
} as const;

export const growthTimeline = [
  {
    period: '2026.06 — 至今',
    title: 'AI 产品开发实习',
    description: '参与 Ionic、Vue 3 与 Capacitor 跨平台产品开发和问题排查。',
  },
  {
    period: '2026.05 — 至今',
    title: 'heart-island 持续开发',
    description: '持续补充 AI 对话、记忆、情绪报告和工程化能力。',
  },
  {
    period: '2024 — 至今',
    title: '软件工程学习',
    description: '通过课程、个人项目和实习积累完整工程经验。',
  },
] as const;
```

- [x] **Step 2: Hero 改为读取 `homeProfile`**

`HeroSection.astro` 的 frontmatter 导入：

```astro
---
import { siteConfig } from '../../config/site';
import { homeProfile } from '../../data/home';
---
```

可见身份结构使用：

```astro
<p class="hero-eyebrow reveal" style="--delay: 60ms">
  <i aria-hidden="true"></i>
  {homeProfile.role}
</p>
<h1 id="hero-title" class="hero-title reveal" style="--delay: 140ms">
  {siteConfig.name}
</h1>
<div class="hero-desc reveal" style="--delay: 280ms">
  <p>{homeProfile.summary}</p>
</div>
```

- [x] **Step 3: 类型与构建验证**

Run:

```bash
pnpm run check
pnpm run build
pnpm run check:home
```

Expected: 三条命令均为 0 退出。

- [x] **Step 4: 检查点**

确认 `rg -n "Davis Leo|Davis" src` 无结果；不要提交。

---

### Task 3: 把 Hero 拆为介绍、中央岛屿与右侧状态

> 执行记录（2026-07-11）：本轮开始时三个 Hero 子区域、语义岛屿控制器和脚本迁移已经存在。核对后确认 SVG 主体未改，指针位移、Reduced Motion、IntersectionObserver 与清理逻辑保持原边界；本轮同时修正 `docs/design-guide.md` 中仍指向已删除 `FeaturedProject.astro` 和旧场景样式入口的说明。

> 浏览器记录：`1440×1000` 为三栏，`1024×768` 为介绍 + 主视觉且状态面板下移，`390×844` 为单列；日间、夜间、主题刷新持久化、滚动 Reveal、Reduced Motion 岛屿暂停和横向溢出均已检查，控制台 0 error。另发现生成 CSS 缺少 `.skip-link` 规则，导致跳转链接作为普通文本可见；该既有问题已登记到 Task 8，不在本任务改变动画与焦点契约。

**Files:**

- Create: `src/components/home/HeroVisual.astro`
- Create: `src/components/home/HeroSidePanel.astro`
- Modify: `src/components/home/HeroSection.astro`
- Reuse: `src/components/home/IslandArtwork.astro`
- Modify: `src/scripts/island-effects.ts`

- [x] **Step 1: 创建 `HeroVisual.astro`**

```astro
---
import IslandArtwork from './IslandArtwork.astro';
---

<div
  class="hero-visual reveal"
  data-island-controller
  aria-label="Heart Island 心屿视觉场景"
  style="--delay: 200ms"
>
  <div class="hero-visual__sky" aria-hidden="true"></div>
  <div class="hero-visual__island">
    <IslandArtwork idPrefix="homepage-heart-island" />
  </div>
  <div class="hero-visual__caption">
    <span>Heart Island</span>
    <a href="/projects/heart-island/">查看项目 →</a>
  </div>
</div>
```

- [x] **Step 2: 创建 `HeroSidePanel.astro`**

```astro
---
import { homeProfile } from '../../data/home';
---

<aside class="hero-side reveal" aria-label="当前状态" style="--delay: 260ms">
  <article class="hero-side__panel">
    <span>当前探索</span>
    <ul>
      {homeProfile.currentExploration.map((item) => <li>{item}</li>)}
    </ul>
  </article>
  <article class="hero-side__panel">
    <span>当前经历</span>
    <strong>{homeProfile.currentExperience.title}</strong>
    <p>{homeProfile.currentExperience.summary}</p>
  </article>
  <article class="hero-side__panel">
    <span>当前状态</span>
    <p>{homeProfile.currentStatus}</p>
  </article>
</aside>
```

- [x] **Step 3: 重写 `HeroSection.astro` 的组合层**

Hero 的直接子节点只保留：

```astro
---
import { siteConfig } from '../../config/site';
import { homeProfile } from '../../data/home';
import HeroSidePanel from './HeroSidePanel.astro';
import HeroVisual from './HeroVisual.astro';
---

<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero-copy">
    <p class="hero-eyebrow reveal" style="--delay: 60ms">
      <i aria-hidden="true"></i>
      {homeProfile.role}
    </p>
    <h1 id="hero-title" class="hero-title reveal" style="--delay: 140ms">
      {siteConfig.name}
    </h1>
    <div class="hero-desc reveal" style="--delay: 280ms">
      <p>{homeProfile.summary}</p>
    </div>
    <div class="hero-actions reveal" style="--delay: 400ms">
      <a class="button button--primary" href="/projects/">
        查看项目 <span aria-hidden="true">↗</span>
      </a>
      <a class="button button--secondary" href="/blog/">
        阅读博客 <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
  <HeroVisual />
  <HeroSidePanel />
</section>
```

- [x] **Step 4: 把岛屿脚本选择器改为语义 data attribute**

`island-effects.ts` 顶部查询改为：

```ts
const controller = document.querySelector<HTMLElement>('[data-island-controller]');
const islandScene = controller?.querySelector<HTMLElement>('.island-scene');
if (!controller || !islandScene) return () => {};
```

后续所有 `featuredProject` 变量改名为 `controller`，事件绑定和清理都使用 `controller`。不改变位移上限、Reduced Motion、IntersectionObserver 或清理逻辑。

- [x] **Step 5: 运行静态检查**

Run:

```bash
pnpm run lint
pnpm run check
pnpm run build
```

Expected: 均通过；首页 HTML 同时包含 `data-island-controller`、`Heart Island` 和三类状态标题。

- [x] **Step 6: 检查点**

确认没有加入 Canvas、Three.js、图片生成资源、天气或音乐；不要提交。

---

### Task 4: 固定 Quick Overview 和首页顶层顺序

> 执行记录（2026-07-11）：审计时本任务涉及的组件、动态数据与结构检查已经存在且符合计划，因此没有为了重演 TDD 而回退实现；本轮补齐设计指南中的固定顺序，并以构建、结构脚本和浏览器检查验证现状。

**Files:**

- Create: `src/components/home/QuickCards.astro`
- Create: `src/components/home/QuickOverview.astro`
- Create: `src/components/home/ArchivePreview.astro`
- Modify: `src/components/home/StatsBar.astro`
- Modify: `src/pages/index.astro`
- Modify: `scripts/check-home-structure.mjs`

- [x] **Step 1: 扩展结构脚本（既有实现已通过，未回退重演失败状态）**

在 `check-home-structure.mjs` 中加入：

```js
const requiredSections = [
  'id="top"',
  'id="quick-status"',
  'id="projects"',
  'id="blog"',
  'id="archive-preview"',
  'id="about"',
];

let previousIndex = -1;
for (const marker of requiredSections) {
  const index = homepage.indexOf(marker);
  if (index === -1) failures.push(`Homepage is missing ${marker}.`);
  if (index !== -1 && index <= previousIndex)
    failures.push(`Homepage section order is wrong at ${marker}.`);
  if (index !== -1) previousIndex = index;
}
```

Run:

```bash
pnpm run build
pnpm run check:home
```

Expected: 因缺少 `quick-status` 或 `archive-preview` 非零退出。

- [x] **Step 2: 把 `StatsBar` 根元素改为可组合的 div**

```astro
<div class="stats-bar" aria-label="个人数据摘要">
  {
    stats.map((stat) => (
      <article class="stats-bar__item reveal">
        <div class="stats-bar__value">{stat.value}</div>
        <div class="stats-bar__label">{stat.label}</div>
      </article>
    ))
  }
</div>
```

项目数与公开文章数继续实时计算；`Internship: 1` 和 `Ongoing` 不扩写成虚构指标。

- [x] **Step 3: 创建 `QuickCards.astro`**

```astro
---
import { getCollection } from 'astro:content';
import { homeProfile } from '../../data/home';

const latestPost = (await getCollection('blog'))
  .filter((entry) => !entry.data.draft && entry.data.publishedAt)
  .sort((a, b) => String(b.data.publishedAt).localeCompare(String(a.data.publishedAt)))[0];
const featuredProject = (await getCollection('projects'))
  .sort((a, b) => a.data.order - b.data.order)
  .find((entry) => entry.data.featured);
---

<div class="quick-cards">
  {
    latestPost && (
      <a class="quick-card reveal" href={`/notes/${latestPost.id}/`}>
        <span>最新文章</span>
        <strong>{latestPost.data.title}</strong>
        <small>{latestPost.data.publishedAt}</small>
        <i aria-hidden="true">→</i>
      </a>
    )
  }
  <a class="quick-card reveal" href="/projects/ai-chat-app/">
    <span>实习进行中</span>
    <strong>{homeProfile.currentExperience.title}</strong>
    <small>{homeProfile.currentExperience.period}</small>
    <i aria-hidden="true">→</i>
  </a>
  {
    featuredProject && (
      <a class="quick-card reveal" href={`/projects/${featuredProject.id}/`}>
        <span>项目精选</span>
        <strong>{featuredProject.data.title}</strong>
        <small>{featuredProject.data.status}</small>
        <i aria-hidden="true">→</i>
      </a>
    )
  }
</div>
```

- [x] **Step 4: 创建 `QuickOverview.astro`**

```astro
---
import QuickCards from './QuickCards.astro';
import StatsBar from './StatsBar.astro';
---

<section class="quick-overview" id="quick-status" aria-label="快速概览">
  <StatsBar />
  <QuickCards />
</section>
```

- [x] **Step 5: 创建 `ArchivePreview.astro`，避免顶层组装出现缺失 import**

```astro
---
import { getCollection } from 'astro:content';

const entries = (await getCollection('blog'))
  .filter((entry) => !entry.data.draft && entry.data.publishedAt)
  .sort((a, b) => String(b.data.publishedAt).localeCompare(String(a.data.publishedAt)))
  .slice(0, 5);
---

<section
  class="home-section archive-preview"
  id="archive-preview"
  aria-labelledby="archive-preview-title"
>
  <header class="section-heading--home reveal">
    <p class="section-kicker">Archive</p>
    <h2 id="archive-preview-title">按时间留下真实开发轨迹。</h2>
    <p>这里只预览最近公开内容，完整时间线进入归档页。</p>
  </header>

  {
    entries.length > 0 ? (
      <ol class="archive-preview__list">
        {entries.map((entry) => (
          <li class="archive-preview__item reveal">
            <time datetime={entry.data.publishedAt ?? ''}>{entry.data.publishedAt}</time>
            <span>{entry.data.category}</span>
            <a href={`/notes/${entry.id}/`}>{entry.data.title}</a>
          </li>
        ))}
      </ol>
    ) : (
      <p class="empty-state reveal">公开文章正在整理中。</p>
    )
  }

  <p class="archive-preview__more reveal"><a href="/archive/">查看完整归档 →</a></p>
</section>
```

- [x] **Step 6: 固定 `index.astro`**

完整组装顺序必须为：

```astro
---
import AboutPreview from '../components/home/AboutPreview.astro';
import ArchivePreview from '../components/home/ArchivePreview.astro';
import FeaturedProjects from '../components/home/FeaturedProjects.astro';
import HeroSection from '../components/home/HeroSection.astro';
import LatestPosts from '../components/home/LatestPosts.astro';
import QuickOverview from '../components/home/QuickOverview.astro';
import SiteFooter from '../components/layout/SiteFooter.astro';
import SiteHeader from '../components/layout/SiteHeader.astro';
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <SiteHeader />
  <main id="main-content">
    <HeroSection />
    <QuickOverview />
    <FeaturedProjects />
    <LatestPosts />
    <ArchivePreview />
    <AboutPreview />
  </main>
  <SiteFooter />
</BaseLayout>
```

- [x] **Step 7: 运行顺序检查**

Run:

```bash
pnpm run build
pnpm run check:home
```

Expected: 结构脚本通过，Astro 构建不出现缺失组件。

- [x] **Step 8: 检查点**

确认 `index.astro` 不再导入 `ExperiencePreview`、`CurrentlyExploring` 或裸 `StatsBar`；不要提交。

---

### Task 5: 收敛 Featured Projects 与 Latest Blog 的真实内容

> 执行记录（2026-07-11）：审计时本任务的 Collection 读取、封面回退、公开文章筛选、动态热门标签和路由链接已经符合计划，因此未重写既有组件；本轮通过内容源、构建产物和真实浏览器检查确认展示只来自现有项目与公开文章。

**Files:**

- Modify: `src/components/home/FeaturedProjects.astro`
- Modify: `src/components/home/LatestPosts.astro`
- Verify: `src/content.config.ts`
- Verify: `src/content/projects/*.md`
- Verify: `src/content/blog/*.md`

- [x] **Step 1: 项目只读取真实条目**

保留当前按 `order` 排序并取前三项的逻辑：

```ts
const projects = (await getCollection('projects'))
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 3);
```

卡片固定使用 Collection 字段：`typeLabel`、`title`、`subtitle`、`stack`、`statusLabel ?? status`。不得新增 Agent Playground，除非对应 Markdown 已真实存在。

- [x] **Step 2: 明确封面回退**

P0 保留统一抽象海岛/编号占位，不把未渲染的 `cover` 假装成已支持。封面容器必须保持 `aria-hidden="true"`；项目文本和详情链接提供完整信息。

- [x] **Step 3: 热门标签由公开文章计算**

把 `LatestPosts.astro` 中硬编码 `hotTags` 改为：

```ts
const publicPosts = (await getCollection('blog'))
  .filter((post) => !post.data.draft && post.data.publishedAt)
  .sort((a, b) => String(b.data.publishedAt).localeCompare(String(a.data.publishedAt)));

const latestPosts = publicPosts.slice(0, 3);
const tagCounts = new Map<string, number>();
publicPosts.forEach((post) => {
  post.data.tags.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1));
});
const hotTags = [...tagCounts.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 8)
  .map(([tag]) => tag);
```

右栏无标签时不渲染空面板。文章不足三篇时按真实数量显示。

- [x] **Step 4: 检查文章入口**

`LatestPosts` 的“查看全部文章”固定到 `/blog/`，文章详情固定到 `/notes/{id}/`。不要同时生成第二套详情 URL。

- [x] **Step 5: 验证**

Run:

```bash
pnpm run check
pnpm run build
```

Expected: 首页项目数不超过 3，文章数不超过 3；构建日志仍生成已有项目和公开文章详情。

---

### Task 6: 把经历与探索合并进 About

> 执行记录（2026-07-11）：审计时 `AboutPreview.astro` 已统一读取 `siteConfig`、`homeProfile` 与 `growthTimeline`，首页也已移除旧经历/探索区块引用；本轮通过构建产物、唯一语义 ID 和真实浏览器检查确认合并结果，同时保持独立 About 与 Archive 页面不变。

**Files:**

- Modify: `src/components/home/AboutPreview.astro`
- Read: `src/data/home.ts`
- Preserve: `src/pages/archive/index.astro`
- Preserve: `src/pages/about.astro`

- [x] **Step 1: About 使用成长轨迹，不再另起两个首页大区块**

`AboutPreview.astro` 导入：

```astro
---
import { siteConfig } from '../../config/site';
import { growthTimeline, homeProfile } from '../../data/home';
---
```

右侧改为：

```astro
<ol class="about-preview__timeline reveal" aria-label="成长轨迹">
  {
    growthTimeline.map((entry) => (
      <li>
        <time>{entry.period}</time>
        <strong>{entry.title}</strong>
        <p>{entry.description}</p>
      </li>
    ))
  }
</ol>
```

左侧姓名、方向、摘要读取 `siteConfig.name`、`homeProfile.role`、`homeProfile.summary`。保留 GitHub、Email 和 `/about/` 链接。

- [x] **Step 2: 验证顶层语义**

Run:

```bash
pnpm run build
pnpm run check:home
```

Expected: 结构脚本通过；首页只出现一个 `#about` 和一个 `#archive-preview`。

- [x] **Step 3: 检查点**

确认首页不再需要单独的 `ExperiencePreview` 和 `CurrentlyExploring`，但本任务暂不删除文件；不要提交。

---

### Task 7: 建立日间 / 夜间 Heart Island 语义 token 并拆分 1000 行首页 CSS

> 执行记录（2026-07-11）：四个首页样式文件与导入顺序在审计时已经完成，但主题仍使用过渡色、缺少强面板与场景遮罩 token，`theme-color` 也仍指向旧纸色。本轮补齐两套已确认 token，让首页专属 Hero、项目、博客和 About 样式消费 `--home-*` 语义变量，并验证正文页继续使用原 `--paper`/`--ink` 契约；未修改心屿 SVG 几何或内容结构。

> 后续色调校准（2026-07-11）：用户提供固定设计令牌后，日间由偏冷雾蓝调整为暖骨白、雾蓝灰与石板蓝，夜间调整为深海蓝黑、靛蓝灰与月光紫蓝。下方最初计划值保留为执行历史，最终代码与后续开发以 `docs/homepage-redesign.md` 的固定契约和 `src/styles/tokens.css` 为准；弱文字、链接蓝和夜间按钮前景按 WCAG 对比度做了必要校准。

**Files:**

- Modify: `src/styles/tokens.css`
- Create: `src/styles/home/base.css`
- Create: `src/styles/home/hero.css`
- Create: `src/styles/home/sections.css`
- Create: `src/styles/home/responsive.css`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/scripts/theme.ts`
- Delete after migration: `src/styles/home.css`

- [x] **Step 1: 增加语义 token，不删除现有 token**

在 `tokens.css` 的日间和夜间主题中加入相同变量名。两个主题共享 DOM、组件和 CSS 结构，不复制样式表，也不用滤镜或简单反色生成另一主题。

日间目标值使用：

```css
:root {
  --home-bg: #eef7ff;
  --home-surface: rgba(255, 255, 255, 0.78);
  --home-surface-strong: rgba(248, 252, 255, 0.92);
  --home-border: rgba(82, 126, 184, 0.2);
  --home-text: #15243b;
  --home-text-secondary: #5d708c;
  --home-text-muted: #7c8da4;
  --home-accent: #2864e8;
  --home-accent-soft: rgba(40, 100, 232, 0.12);
  --home-glow: rgba(95, 157, 230, 0.22);
  --home-panel-shadow: 0 18px 48px rgba(61, 96, 139, 0.14);
  --home-scene-overlay: linear-gradient(
    180deg,
    rgba(238, 247, 255, 0.08),
    rgba(222, 239, 252, 0.5)
  );
}
```

夜间目标值使用：

```css
html[data-theme='dark'] {
  --home-bg: #030d20;
  --home-surface: rgba(8, 24, 48, 0.78);
  --home-surface-strong: rgba(12, 32, 61, 0.9);
  --home-border: rgba(126, 166, 224, 0.2);
  --home-text: #f1f6ff;
  --home-text-secondary: #9eb0ce;
  --home-text-muted: #7489aa;
  --home-accent: #8196ff;
  --home-accent-soft: rgba(129, 150, 255, 0.16);
  --home-glow: rgba(83, 111, 255, 0.28);
  --home-panel-shadow: 0 20px 60px rgba(0, 0, 0, 0.26);
  --home-scene-overlay: linear-gradient(180deg, rgba(3, 13, 32, 0.02), rgba(3, 13, 32, 0.58));
}
```

这些 token 只用于首页视觉，不修改正文页 `--paper`/`--ink` 契约。面板、文字、边框、阴影、岛屿环境光和场景叠层必须全部消费语义变量，禁止组件内散落主题专用色值。

实现氛围层级时按“背景资源 → 主题遮罩 → 岛屿环境光 → 内容面板 → 文本与交互”组织。可参考 XingHuiSama 的分层思路，但实际数值、资源和代码必须独立实现；面板透明度不得牺牲正文对比度。

- [x] **Step 2: 创建 `home/base.css`**

从现有 `home.css` 原样迁移以下块：

- `No-JS reveal fallback`
- `Section spacing`
- `Section Heading`
- `Footer update`

并加入首页背景容器规则：

```css
body:has(#main-content > .hero) {
  background:
    radial-gradient(circle at 50% 12%, var(--home-glow), transparent 34rem), var(--home-bg);
  color: var(--home-text);
}

.quick-overview,
.home-section {
  width: var(--page);
  margin-inline: auto;
}

.quick-overview {
  padding-bottom: clamp(72px, 8vw, 112px);
}
```

- [x] **Step 2a: 同步浏览器主题色**

把 `BaseLayout.astro` 的初始 `<meta name="theme-color">` 日间值设为 `#eef7ff`，并让 `theme.ts` 在切换时同步：日间 `#eef7ff`、夜间 `#030d20`。继续复用现有主题持久化和 `galilieo:theme-change`，不要创建第二套主题脚本。

- [x] **Step 3: 创建 `home/hero.css`**

从现有 `home.css` 迁移 Hero 和 Stats Bar 块，再按三栏改为：

```css
.hero {
  width: var(--page);
  min-height: calc(100svh - 68px);
  margin-inline: auto;
  padding: clamp(48px, 6vh, 84px) 0 clamp(36px, 5vh, 64px);
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(420px, 1.6fr) minmax(250px, 0.8fr);
  gap: clamp(24px, 3vw, 48px);
  align-items: center;
}

.hero-visual,
.hero-side__panel,
.quick-card {
  border: 1px solid var(--home-border);
  background: var(--home-surface);
  box-shadow: var(--home-panel-shadow);
}

.hero-visual {
  position: relative;
  min-height: clamp(420px, 56vw, 640px);
  overflow: hidden;
  border-radius: 26px;
}

.hero-visual__island {
  position: absolute;
  inset: 20% 4% 10%;
}

.hero-side {
  display: grid;
  gap: 14px;
}

.hero-side__panel {
  padding: 20px;
  border-radius: 18px;
}

.quick-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.quick-card {
  min-height: 132px;
  padding: 20px;
  border-radius: 18px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  color: var(--home-text);
}
```

把 `global.css` 中 `.island-scene`、`.island-art-*`、`.island-contours-*`、`.island-signal` 所需规则迁移到该文件；迁移完成前不删除原规则。

- [x] **Step 4: 创建 `home/sections.css`**

从现有 `home.css` 迁移并保留以下完整块：

- Featured Projects
- Latest Posts
- Blog page note time
- Archive page
- About Preview

删除 Experience Preview 和 Currently Exploring 专属块前，先完成 Task 9 的组件清理。

新增归档预览规则：

```css
.archive-preview__list {
  list-style: none;
  margin: 44px 0 0;
  padding: 0;
  border-top: 1px solid var(--home-border);
}

.archive-preview__item {
  display: grid;
  grid-template-columns: 120px 120px minmax(0, 1fr);
  gap: 20px;
  padding: 18px 0;
  border-bottom: 1px solid var(--home-border);
}

.about-preview__timeline {
  list-style: none;
  margin: 0;
  padding: 0 0 0 28px;
  border-left: 1px solid var(--home-border);
}

.about-preview__timeline li {
  position: relative;
  padding: 0 0 28px;
}
```

- [x] **Step 5: 创建 `home/responsive.css`**

把现有 `home.css` 的 responsive 块迁移后，收敛为三个层级：

```css
@media (max-width: 1199px) {
  .hero {
    grid-template-columns: minmax(0, 1fr) minmax(420px, 1.2fr);
  }

  .hero-side {
    grid-column: 1 / -1;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .hero-copy,
  .hero-visual,
  .hero-side {
    grid-column: 1;
  }

  .hero-side,
  .quick-cards,
  .featured-projects__grid,
  .latest-posts__content,
  .about-preview--home {
    grid-template-columns: 1fr;
  }

  .archive-preview__item {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}

@media (max-width: 580px) {
  .hero-visual {
    min-height: 340px;
    border-radius: 18px;
  }

  .stats-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quick-card {
    min-height: 112px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-visual,
  .hero-side__panel,
  .quick-card {
    scroll-behavior: auto;
  }
}
```

小于 768px 不使用大面积 `backdrop-filter`；若桌面使用模糊，只在 `@supports (backdrop-filter: blur(1px))` 内声明。

- [x] **Step 6: 更新 `BaseLayout.astro` 导入顺序**

用以下顺序替换 `home.css` 导入：

```ts
import '../styles/home/base.css';
import '../styles/home/hero.css';
import '../styles/home/sections.css';
import '../styles/home/responsive.css';
```

它们必须位于 `content.css` 之后。确认新文件完整承接规则后删除 `src/styles/home.css`。

- [x] **Step 7: 验证 CSS 构建与未使用旧导入**

Run:

```bash
rg -n "styles/home.css" src
pnpm run lint
pnpm run check
pnpm run build
```

Expected: `rg` 无结果；三项工程检查通过。

- [x] **Step 8: 检查点**

确认没有在组件 `<style>` 或 `global.css` 末尾追加同名覆盖；不要提交。

---

### Task 8: 保留无 JavaScript、键盘和 Reduced Motion 契约

> 执行记录（2026-07-11）：修复 `animations.css` 机械重复导致后续 CSS 被解析器吞掉的问题，恢复 Reveal、SVG 描边、等高线呼吸、交互信号与 Reduced Motion 的单一有效实现；`check:home` 新增构建产物中的 skip link 与 no-JS 回退断言。岛屿静态居中改用独立 `translate`，动态指针位移继续使用 `transform`，避免 Reduced Motion 清空动态变换时破坏构图。移动菜单关闭态从 Tab 顺序移除，键盘打开后聚焦首项、Escape 归还焦点；无 JavaScript 窄屏改为静态五项导航。另移除 921–1180px 隐藏“归档/关于”但没有菜单入口的旧规则。浏览器验证覆盖 1440×1000、1024×768、390×844、浅色/深色、Reduced Motion、无 JavaScript、主题持久化、菜单键盘路径与控制台。

**Files:**

- Verify/Modify: `src/layouts/BaseLayout.astro`
- Verify/Modify: `src/styles/home/base.css`
- Modify: `src/styles/animations.css`
- Verify/Modify: `src/scripts/reveal.ts`
- Verify/Modify: `src/scripts/navigation.ts`
- Verify/Modify: `src/scripts/island-effects.ts`

- [x] **Step 1: 保留 JS 标记和 no-JS 回退**

`BaseLayout.astro` 必须在 head 中保留：

```html
<script is:inline>
  document.documentElement.classList.add('js');
</script>
```

`home/base.css` 必须保留：

```css
html:not(.js) .reveal {
  opacity: 1;
  transform: none;
}
```

- [x] **Step 2: Reduced Motion 禁止持续岛屿位移**

在 `animations.css` 的现有 reduced-motion 块确认包含：

```css
@media (prefers-reduced-motion: reduce) {
  .island-art-shell,
  .island-contours,
  .island-signal {
    animation: none !important;
    transform: none !important;
  }
}
```

不要删除全局 transition/animation 降级和 `.reveal` 立即显示规则。

- [x] **Step 3: 键盘路径检查**

Header 菜单必须继续满足：

- `aria-expanded` 随开关变化。
- Escape 关闭。
- 点击导航链接关闭。
- focus-visible 清晰。
- 主题按钮 `aria-pressed` 与主题同步。
- skip link 仅在获得键盘焦点时进入视口；不能因为 Reduced Motion 或样式未进入构建产物而永久显示。

如果现有实现已经满足，只记录验证，不重写模块。

构建后同时检查：

```bash
rg -n "\.skip-link" dist/_astro/*.css
```

Expected: 生成 CSS 中包含默认隐藏和 `:focus-visible` 两条规则。

- [x] **Step 4: 生命周期检查**

`main.ts` 继续在 `astro:page-load` 初始化、`astro:before-swap` 清理。`island-effects.ts` 必须清理 pointer、MediaQuery、visibility 与 IntersectionObserver。

- [x] **Step 5: 构建后无 JS 静态检查**

Run:

```bash
pnpm run build
rg -n "html:not\(.js\) \.reveal" src/styles/home/base.css
rg -n "document.documentElement.classList.add\('js'\)" src/layouts/BaseLayout.astro
```

Expected: 两个 `rg` 均命中一次。

---

### Task 9: 删除未引用的旧首页组件和旧样式

> 执行记录（2026-07-11）：引用审计确认九个旧首页组件在当前工作区已全部删除，`AboutSection.astro` 与 `IslandArtwork.astro` 保持存在并分别由 About 页和 Hero 使用；`FeaturedProjects` 仅是旧名 `FeaturedProject` 的子串，不构成旧组件引用。计划列出的 `global.css`、`animations.css` 与 `home/sections.css` 已无旧顶层选择器，本轮继续移除 `global.css`、`typography.css`、`utilities.css` 中没有任何 Astro 消费者的 StatusStrip、FeaturedProject、Experience、Stack、Contact、旧 Notes 变体和项目扩展样式；项目页使用的 `project-entry`、博客页使用的 `note-entry` 以及心屿样式全部保留。

**Files:**

- Delete after reference audit:
  - `src/components/home/ContactSection.astro`
  - `src/components/home/CurrentlyExploring.astro`
  - `src/components/home/ExperiencePreview.astro`
  - `src/components/home/ExperienceSection.astro`
  - `src/components/home/FeaturedProject.astro`
  - `src/components/home/NotesSection.astro`
  - `src/components/home/ProjectsSection.astro`
  - `src/components/home/StackSection.astro`
  - `src/components/home/StatusStrip.astro`
- Preserve: `src/components/home/AboutSection.astro`
- Preserve: `src/components/home/IslandArtwork.astro`
- Modify: `src/styles/global.css`
- Modify: `src/styles/animations.css`
- Modify: `src/styles/home/sections.css`

- [x] **Step 1: 证明旧组件未被引用**

Run:

```bash
rg -n "ContactSection|CurrentlyExploring|ExperiencePreview|ExperienceSection|FeaturedProject|NotesSection|ProjectsSection|StackSection|StatusStrip" src/pages src/layouts src/components --glob "!src/components/home/{ContactSection,CurrentlyExploring,ExperiencePreview,ExperienceSection,FeaturedProject,NotesSection,ProjectsSection,StackSection,StatusStrip}.astro"
```

Expected: 无 import 或组件使用。若有结果，停止删除并先调整调用方。

- [x] **Step 2: 删除九个已证明未引用的组件**

只删除上方列表；不得删除 `AboutSection.astro` 或 `IslandArtwork.astro`。

- [x] **Step 3: 移除旧组件专属 CSS**

在新岛屿样式已经进入 `home/hero.css` 后，从 `global.css` 和 `animations.css` 删除仅属于下列选择器的规则：

```text
.featured-project
.featured-project__topline
.featured-project__heading
.featured-project__link
.featured-project__footer
.project-tags
.experience-section
.experience-grid
.notes-section
.projects-section
.stack-section
.status-strip
```

不要删除 `.island-scene`、`.island-art-*`、`.island-contours-*` 的新位置规则，也不要删除项目详情、文章详情或 About 页面使用的通用规则。

- [x] **Step 4: 从 `home/sections.css` 删除旧预览专属块**

删除 `Experience Preview` 和 `Currently Exploring` 块，因为对应信息已进入 Quick Cards、Hero Side Panel 与 About Preview。

- [x] **Step 5: 全量引用和构建验证**

Run:

```bash
rg -n "ContactSection|CurrentlyExploring|ExperiencePreview|ExperienceSection|FeaturedProject|NotesSection|ProjectsSection|StackSection|StatusStrip" src
pnpm run verify
```

Expected: `rg` 无业务引用；verify 完整通过，包括 `check:home`。

- [x] **Step 6: 检查点**

检查 `git diff --stat`，确认删除的是旧首页实现，没有删除内容、项目、文章、About 详情或岛屿主体；不要提交。

---

### Task 10: 浏览器验收与最终文档同步

> 执行记录（2026-07-11）：本地 `astro preview` 完成最终验收。1440×1000 日间/夜间结构、区块顺序和 Hero 三栏一致，未加载文档原型或第三方截图；1024×768 状态面板下移、项目两列、完整 Header 可达；390×844 单列且无横向溢出。最终内容校准后额外发现 `/projects/` 的 hover 背景伪元素在 390px 向右越界 4px，已在现有 680px 断点内收回边界并复测 scrollWidth 等于 viewport。Reduced Motion 停止等高线动画与指针位移，无 JavaScript 时六个首页区块和静态导航可读。首页 → 项目 → 首页的 Astro 切换后只有一个岛屿控制器和场景实例，移动菜单、Escape、链接关闭与键盘焦点通过，干净会话控制台 0 error。主要页面、项目详情、博客正文、RSS、sitemap、robots 均返回 200，未知路径返回真实 404；canonical、基础 SEO 与默认分享图存在。`docs/homepage-redesign.md` 和 README 已同步为 P0 已实现并验证，P1/P2 未完成项保持明确。

**Files:**

- Modify only if implementation differs: `docs/homepage-redesign.md`
- Modify if directory responsibilities changed: `README.md`
- Update checkboxes: `tasks/active/homepage-p0-implementation.md`

- [x] **Step 1: 启动预览**

Run:

```bash
pnpm run build
pnpm run preview
```

Expected: preview 启动成功，终端无运行时错误。

- [x] **Step 2: 桌面检查**

代表视口：1440×1000。检查：

- Hero 为左侧身份、中间岛屿、右侧状态三栏。
- Quick Overview 紧接 Hero。
- 首页顺序与结构脚本一致。
- 项目、文章、归档、关于链接可达。
- 夜间主题对照夜间高保真图，呈现深海蓝、低亮度玻璃和克制蓝紫光效，但没有天气、音乐和虚构统计。
- 日间主题对照日间高保真图，呈现雾蓝、明亮半透明面板和清晰阴影，不是夜间主题的简单反色。
- 两种主题的 DOM、区块顺序、组件尺寸和内容完全一致；切换后只改变语义颜色、阴影和岛屿环境氛围。
- 原型图没有被加载为页面背景，Hero 当前背景由 CSS、现有 SVG 和占位资源组成。

- [x] **Step 3: 平板检查**

代表视口：1024×768。检查：

- Hero 为介绍 + 主视觉，状态面板下移。
- 项目最多两列，Blog 侧栏不挤压正文。
- Header 不换行、不遮挡内容。

- [x] **Step 4: 手机检查**

代表视口：390×844。检查：

- 所有区块单列，无横向溢出。
- 主视觉位于个人介绍后。
- 状态卡、项目、文章和时间线可扫读。
- 移动菜单可打开、Escape/链接可关闭。
- 不依赖 hover 才能看到信息。

- [x] **Step 5: 降级检查**

分别检查：

- `prefers-reduced-motion: reduce`：无循环、视差和长位移。
- 禁用 JavaScript：标题、项目、文章、归档和链接仍可读。
- 首页 → 项目 → 首页的 Astro 页面切换：没有重复事件、重复岛屿实例或控制台错误。

- [x] **Step 6: 最终工程验证**

Run:

```bash
pnpm run verify
```

Expected:

- ESLint 通过。
- Astro check 为 0 errors / 0 warnings / 0 hints。
- Astro build 成功生成所有真实路由、RSS 和 sitemap。
- Homepage structure 输出通过。

并确认源码没有引用文档原型图：

```bash
rg -n "homepage-(day|night)-reference" src
```

Expected: 无输出，退出码 1（未匹配）。

同时检查第三方参考图未进入源码：

```bash
rg -n "xinghuisama-(day|night|mobile)-reference" src
```

Expected: 无输出，退出码 1（未匹配）。

- [x] **Step 7: 同步文档事实**

只有浏览器与 verify 都通过后，才把 `docs/homepage-redesign.md` 状态从“部分 P0”更新为“P0 implemented and verified”。没有完成的 P1/P2 保持明确未实施。

- [x] **Step 8: 最终检查点**

向用户报告：

- 修改与删除文件。
- 当前首页结构和数据来源。
- 浏览器验证矩阵结果。
- P1/P2 尚未实现内容。
- 未提交、未推送、未部署。

## 3. 停止条件

出现以下任一情况立即停止，不用临时方案绕过：

- 需要修改 Content schema 才能继续。
- 需要新依赖、Vue、Three.js、Pagefind 或服务端能力。
- 任一日间 / 夜间参考图要求与真实内容、可访问性或移动端可用性冲突。
- 发现其他会话正在修改同一文件。
- 无法确认旧组件是否仍被页面引用。
- 需要公开新的实习事实、公司信息或未确认成果。
- `pnpm run verify` 在连续两次修复后仍因相同原因失败。

## 4. 实施完成定义

只有同时满足以下条件，P0 才能标记完成：

- Galilieo 是所有公开页面的唯一品牌名称。
- 首页顶层顺序与 DOM id 契约一致。
- Hero 三栏和移动端降级符合设计文档。
- Quick Cards、项目、文章和归档全部来自真实数据。
- About 不把未来计划写成已完成经历。
- 新旧首页组件已经收敛为一套。
- 首页样式已经从单个 1000 行文件拆分，且没有在 `global.css` 末尾堆覆盖。
- 日间、夜间、Reduced Motion、无 JavaScript、键盘和代表视口均完成浏览器检查。
- 两张高保真参考图仅保存在 `docs/assets/`，没有作为生产背景或内容资源进入 `src/`。
- XingHuiSama 第三方截图只保存在文档资源中，并保留来源和 CC BY-NC 4.0 说明。
- `pnpm run verify` 完整通过。
- 文档已更新为当前事实。
- 没有自动 commit、push、PR 或 deploy。

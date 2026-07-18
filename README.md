# Galilieo Atlas

Galilieo 的个人作品、开发笔记与探索记录，用于展示个人方向、真实项目与开发经历，并重点记录「heart-island 心屿」。

> Works · Notes · Explorations

- 在线地址：<https://galilieo.heart-island.cn>
- 部署形态：Astro 静态构建，Nginx 托管
- License：[MIT](LICENSE)

## 主要内容

- 个人介绍、技术方向与联系方式
- 个人项目、实习经历与工程实践
- heart-island 心屿重点项目
- 项目日志、实习复盘与技术笔记

## 技术栈

- Astro 7、TypeScript strict
- Astro Content Collections、Markdown / MDX
- 原生 CSS、CSS Variables、内联 SVG、少量浏览器 TypeScript
- Astro View Transitions（`ClientRouter`）
- RSS、Sitemap
- ESLint、Astro Check、Prettier
- pnpm、Nginx

项目没有数据库、CMS、用户系统或应用后端，也不使用 React、Vue、Svelte、Tailwind、GSAP 或 Three.js 作为本站运行时。

Pagefind 全站搜索、Giscus 评论和 Vue 3 交互岛属于按内容规模与复杂交互需求评估的候选能力，当前尚未安装或接入。

## 快速开始

要求 Node.js 22.12+ 和 pnpm 11.11.0；版本依据当前 Astro 依赖和 `packageManager` 字段。

```bash
corepack enable
pnpm install
pnpm run dev
```

开发服务器默认运行在 `http://localhost:4321`。

## 启动博客后台

Galilieo Studio 是仅在个人电脑运行的本地博客写作后台。首次使用先在仓库根目录安装依赖：

```bash
pnpm install
```

随后启动 Studio：

```bash
pnpm run studio
```

Windows Git Bash 如果无法直接调用 pnpm，可改用：

```bash
node scripts/blog-studio.mjs
```

启动器会优先复用当前仓库已经运行的 Astro 开发服务；没有可用预览时会自动启动一个。Studio 从默认端口开始寻找可用的 loopback 端口，因此请以终端实际输出为准，例如：

```text
Galilieo Studio: http://127.0.0.1:<动态端口>/
Astro preview:   http://localhost:<预览端口>/
```

在浏览器打开终端显示的 `Galilieo Studio` 地址即可写作。按 `Ctrl+C` 停止 Studio；启动器只会清理本次由它启动的 Astro 预览，不会结束原本已经运行的开发服务。

Studio 直接读写 `src/content/blog/*.md`，支持文章库、专注写作、真实页面预览、文章设置和发布检查。它只监听本机 loopback，不会进入 `dist/`；“发布”只更新本地 Markdown 状态并运行检查，不会自动 Commit、Push 或部署服务器。详细使用说明见[内容维护指南](docs/content-guide.md#使用本地-galilieo-studio)。

## 常用检查

```bash
pnpm run lint
pnpm run check
pnpm run build
pnpm run verify
pnpm run preview
```

`verify` 依次运行 lint、check 和 build；`build` 输出到 `dist/`。涉及视觉或交互时再用 preview 做浏览器检查。

## 构建方式

```text
Markdown / MDX 内容
        ↓
Astro 页面与组件
        ↓
静态构建 dist/
        ↓
Nginx 部署
```

浏览器脚本负责主题、导航、滚动显现、当前区块和心屿交互增强；无 JavaScript 时正文、项目、文章和静态导航仍可读。文档按个人静态网站的维护需求组织。

## 主要目录

```text
src/pages/          页面与文件路由：首页、项目、博客、RSS、404
src/layouts/        HTML 外壳、SEO、文章与项目详情布局
src/components/     布局、首页、项目、博客和通用组件
src/content/        projects 与 blog 的 Markdown / MDX
src/config/site.ts  站点信息、导航、联系方式和外部链接
src/styles/         token、排版、页面、动画与正文样式
src/scripts/        主题、导航、Reveal、active section、心屿指针增强
src/assets/         由 Astro/Vite 处理的图片与 SVG
public/             favicon、robots.txt 等固定公开路径资源
docs/               内容、设计与部署指南
scripts/            本地验证等小型工程脚本
tasks/              active、backlog、archive 三类任务说明
.agents/skills/      项目本地 Agent 技能
sketches/           homepage、island-motion 与 research，不进入 Astro 构建
```

主要路由由 `src/pages/` 生成：`/`、`/about/`、`/projects/`、`/projects/[slug]/`、`/blog/`、`/archive/`、`/notes/`、`/notes/[slug]/`、`/rss.xml` 和 `/404.html`。`@astrojs/sitemap` 在构建时生成 sitemap。

## 内容修改入口

- 站点名称、域名、作者、导航、邮箱与外链：`src/config/site.ts`
- 首页身份简介：`src/data/home.ts`；仪表盘组件：`src/components/home/`
- Content Collections schema：`src/content.config.ts`
- 项目：`src/content/projects/`
- 文章：`src/content/blog/`
- 主题与视觉 token：`src/styles/tokens.css`
- 心屿展示与动效：`src/components/home/IslandArtwork.astro`、`src/styles/animations.css`、`src/scripts/island-effects.ts`

具体操作见 [内容维护指南](docs/content-guide.md)。

## 文档

- [内容维护指南](docs/content-guide.md)：修改个人信息、新增项目和文章、发布前检查
- [设计维护指南](docs/design-guide.md)：主题、响应式、可访问性和心屿视觉边界
- [首页设计与阶段边界](docs/homepage-redesign.md)：两行仪表盘、双主题、交互分层与 P1/P2 边界
- [部署指南](docs/deployment.md)：构建、Nginx 发布、验证与回滚

## 部署

运行 lint、check、build 后，将 `dist/` 的内容发布到 Nginx 静态目录。站点是静态多页面，不要配置 SPA fallback；不存在的 URL 应返回 `404.html`。完整步骤见 [部署指南](docs/deployment.md)。

## License

[MIT](LICENSE)

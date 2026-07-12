# 首页信息架构重构

- **状态：** 已完成第一轮结构实现；后续方案由 `docs/homepage-redesign.md` 接管

## 目标

将首页重构为长期可扩展的个人作品集与技术博客入口，突出项目、真实实习经历、最近文章和 AI 应用开发方向；参考图只用于层级与氛围，不照搬其音乐、天气、时钟、心形或重型玻璃效果。

## 范围

- 顶部导航：首页、项目、博客、归档、关于、主题切换。
- 首页顺序：Hero、StatsBar、FeaturedProjects、ExperiencePreview、LatestPosts、CurrentlyExploring、AboutPreview、Footer。
- 首页项目和文章继续读取 Content Collections，不改博客正文数据。
- 补齐 `/blog` 与 `/archive` 页面入口；保留已有 `/notes` 内容路径的兼容性。
- 使用现有 Astro、TypeScript、原生 CSS 与客户端主题/菜单机制，不增加框架或依赖。

## 不修改范围 / 不变量

- 不修改 `src/assets/svg/island-reference-no-heart-vector.svg`、`src/components/home/IslandArtwork.astro`、`src/scripts/island-effects.ts` 的几何、分层、粒子和动效语言。
- 不改变已批准的岛屿形状和水纹布局，不加入心形图标。
- 不添加音乐、天气、时钟、宠物、照片墙、说说、全站 3D、复杂粒子或重玻璃模糊。
- 不修改现有博客文章正文与 frontmatter。
- 不提交、不推送、不部署，不清理用户现有未提交改动。

## 步骤

1. 调整站点导航与首页组装顺序。
2. 建立 Hero、状态卡、数据条、精选项目、实习预览、最新文章、探索路线和关于预览组件。
3. 用统一语义 CSS Variables 与单独首页样式完成桌面、平板和移动布局。
4. 新增 `/blog` 兼容入口与单列 `/archive` 时间线页面。
5. 修复无 JavaScript 时 Reveal 内容不可见的已知降级问题（如不扩大脚本范围即可完成）。
6. 运行 verify，并检查真实页面的主题、菜单、焦点、Reduced Motion、无 JS 和横向溢出。

## 验收

- 首页内容顺序与任务要求一致，核心信息首屏可读。
- 首页只展示 3 个项目与最近 3 篇公开文章，并有清晰完整列表入口。
- 导航含 `/projects`、`/blog`、`/archive`、`/about`。
- 1440×1000、1024×768、390×844 无横向溢出；移动菜单和主题切换可用。
- 浅色、深色、Reduced Motion、无 JavaScript 下主要内容和链接可读。
- `pnpm run verify` 完整通过，浏览器控制台无本次改动引入的错误。

## 命令

```bash
pnpm run verify
pnpm run preview
```

## 风险

- 当前工作区已有大量未提交改动，实施必须限定文件并避免覆盖用户修改。
- 旧首页 CSS 体量较大，新结构需避免依赖冲突和末尾覆盖堆叠。
- `/notes` 是现有文章详情路径；新增 `/blog` 时需保持旧链接可用。

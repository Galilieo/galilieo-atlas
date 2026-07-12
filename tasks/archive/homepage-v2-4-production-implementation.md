# Galilieo Atlas 首页 v2.4 正式实施计划

- 状态：已完成并验证（2026-07-11）
- 目标：把已确认的 `codex-luminous-archive-v2` v2.4 信息职责与视觉层级迁移到现有 Astro 首页，不复制原型单文件实现，不接入实时 API。

## 范围与不变量

- 保留首页区块顺序、Content Collections、现有 Heart Island SVG、主题系统、移动菜单、Reveal 与客户端生命周期。
- 不修改岛屿 path，不引入框架或依赖，不接天气、音乐、GitHub 数据接口，不自动播放音频。
- 正式站点名称改为 `Galilieo Atlas`；作者姓名仍是 `Galilieo`。
- 项目数和公开文章数继续由 Astro 构建时计算，不硬编码。

## 实施步骤

- [x] **品牌与 SEO**：更新 `src/config/site.ts`、`src/pages/rss.xml.ts`、Header 与 Footer 使用的站点名称、标题和描述；同步 README。
- [x] **唯一的个人入口卡**：修改 `src/components/home/HeroSection.astro`，读取真实 Works/Notes 数量，提供整卡 About、Projects、Blog、GitHub、Email 与 Heart Island 独立入口。
- [x] **右侧功能卡位**：用 `HeroUtilityRail.astro` 替换 `HeroSidePanel.astro`，渲染时间/天气、音乐和 GitHub 三张静态预留卡；所有未接入状态必须可感知且控件禁用。
- [x] **About 摘要**：精简 `src/components/home/AboutPreview.astro`，仅保留 `growthTimeline` 与 `/about/` 入口。
- [x] **视觉与响应式**：在 `src/styles/home/hero.css`、`sections.css`、`responsive.css` 中复用 `--home-*` token 完成桌面三栏、平板三卡横排、移动端天气/GitHub 并排与音乐整行；不增加相邻断点。
- [x] **文档同步**：更新 `docs/content-guide.md` 与 `docs/homepage-redesign.md` 的当前实现状态，明确卡片只是预留能力。
- [x] **自动验证**：运行 `node scripts/verify.mjs` 与 `git diff --check`。
- [x] **浏览器验证**：检查 1440×1000、1024×768、390×844，日间/夜间、主题刷新、移动菜单、键盘焦点、Reduced Motion、无 JavaScript、控制台与横向溢出。

## 验收

- 首页只出现一份身份与联系方式；底部 About 不重复个人名片。
- Hero 中央 Heart Island 的主体比例与识别不变，右侧预留卡不压过主视觉。
- Works/Notes 数量和链接来自真实内容；不存在杂谈、照片等虚构入口。
- 未接入卡不显示虚构时间、天气、歌曲或贡献数据，音乐按钮不可操作。
- 所有验证通过；未运行的生产预览或外部功能明确列出。

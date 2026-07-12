# Codex 独立首页原型 Implementation Plan

> 状态：独立备选方案已完成，最终由 `codex-luminous-archive-v2` v2.4 取代并归档（2026-07-11）。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. 本计划由当前 Codex 会话内联执行，不派发子代理，不读取其他设计者的原型文件。

**Goal:** 独立完成一套可与其他方案并排比较的 Galilieo 日夜双主题完整首页高保真原型。

**Architecture:** 原型使用一个可独立打开的 HTML 文件承载语义结构、CSS 视觉和少量主题切换脚本，所有内容来自当前生产配置与 Content Collections。设计产物只写入 `sketches/homepage/codex-independent-v1/`，评审前不修改 `src/`，也不读取 `sketches/` 中其他设计目录的实现。

**Tech Stack:** Semantic HTML、原生 CSS、少量原生 JavaScript、Chrome 无头截图；不新增项目依赖。

---

## 文件边界

- Create: `sketches/homepage/codex-independent-v1/README.md` — 记录概念、真实内容依据、参考边界和评审要点。
- Create: `sketches/homepage/codex-independent-v1/index.html` — 可交互的日夜双主题完整首页原型。
- Create: `sketches/homepage/codex-independent-v1/codex-day-desktop.png` — 日间桌面比较图。
- Create: `sketches/homepage/codex-independent-v1/codex-night-desktop.png` — 夜间桌面比较图。
- Create: `sketches/homepage/codex-independent-v1/codex-day-mobile.png` — 日间移动端比较图。
- Modify: `tasks/active/homepage-prototype-v1.md` — 只更新已完成检查项和评审结论。

不修改 `src/`、`docs/assets/` 或其他 `sketches/` 子目录。只有本方案被选中后，才将最终比较图和规则合并到正式文档。

### Task 1: 建立独立设计说明

**Files:**

- Create: `sketches/homepage/codex-independent-v1/README.md`

- [x] **Step 1: 写明方案概念和隔离规则**

写入以下明确结论：

```markdown
# Codex Independent Homepage v1

概念：潮汐观测站 / Tidal Observatory

以 Heart Island 为视觉锚点，把项目、文章和成长记录组织成持续接收的“开发信号”与“航海日志”。日间是雾海中的开放观测台，夜间是深海中的低照度观测舱；两套主题共享相同的信息结构。

本目录由 Codex 独立设计。制作期间不读取或复用其他原型目录的 HTML、CSS、图片和设计说明。
```

- [x] **Step 2: 记录真实内容来源**

列出 `src/config/site.ts`、`src/data/home.ts`、三个项目条目和四篇公开文章，明确原型不得增加时间、天气、音乐、GitHub 热力或虚构统计。

- [x] **Step 3: 记录参考与原创边界**

说明允许借鉴日夜氛围、玻璃层次、背景分层和响应式方法；版式隐喻、内容组织、装饰符号、交互节奏和实现代码由本方案独立完成。

### Task 2: 搭建完整首页语义骨架

**Files:**

- Create: `sketches/homepage/codex-independent-v1/index.html`

- [x] **Step 1: 创建便携式 HTML 文档**

文档包含 viewport、中文语言、主题色和内联样式；不引用网络字体、第三方脚本或其他原型资源。页面根节点使用 `data-theme="day"`，主题按钮在 `day` 与 `night` 之间切换。

- [x] **Step 2: 按固定顺序加入语义区块**

使用以下结构，避免为了视觉效果改变内容顺序：

```html
<header class="site-header">...</header>
<main>
  <section class="hero" id="top">...</section>
  <section class="signal-deck" aria-label="快速概览">...</section>
  <section class="projects" id="projects">...</section>
  <section class="notes" id="blog">...</section>
  <section class="archive" id="archive">...</section>
  <section class="about" id="about">...</section>
</main>
<footer class="site-footer">...</footer>
```

- [x] **Step 3: 接入真实首页内容**

Hero 使用 Galilieo、`AI 应用开发者 / 软件工程学生` 和当前 summary；项目只展示 heart-island、AI Chat App、Galilieo Portfolio；文章只展示当前四篇公开文章中的最新三篇；经历只使用 `src/data/home.ts` 已公开内容。

- [x] **Step 4: 为素材缺失设计占位**

岛屿背景使用原创 CSS/SVG 几何占位；项目与文章封面使用编号、类别和抽象潮汐纹理，不把参考截图或第三方图片作为正式素材。

### Task 3: 完成“潮汐观测站”日夜视觉

**Files:**

- Modify: `sketches/homepage/codex-independent-v1/index.html`

- [x] **Step 1: 建立语义主题令牌**

在原型内使用以下基础令牌，并允许在视觉校准时只微调透明度与阴影，不另起第二套任意颜色：

```css
:root {
  --page: #f3f2ed;
  --page-soft: #eaeff2;
  --panel: rgba(248, 248, 245, 0.86);
  --panel-strong: rgba(255, 255, 255, 0.94);
  --ink: #182235;
  --muted: #5e6978;
  --line: rgba(108, 124, 139, 0.18);
  --accent: #4b62cf;
  --accent-soft: #e3e7fa;
  --glow: rgba(91, 110, 214, 0.18);
}

[data-theme='night'] {
  --page: #06101e;
  --page-soft: #091727;
  --panel: rgba(13, 27, 45, 0.78);
  --panel-strong: rgba(18, 34, 56, 0.9);
  --ink: #eef3fc;
  --muted: #a5b0c2;
  --line: rgba(138, 163, 203, 0.16);
  --accent: #7d8cff;
  --accent-soft: #1c2852;
  --glow: rgba(117, 137, 255, 0.32);
}
```

- [x] **Step 2: 设计桌面视觉层级**

Header 保持细薄；Hero 使用身份区、心屿观测窗、当前信号区三栏；Quick Overview 形成横向信号带；项目区使用一个重点项目加两个次级项目；博客区使用日志列表；归档与关于并列收束页面。

- [x] **Step 3: 建立原创识别元素**

使用潮位刻度、坐标细线、信号圆点、航海编号和低对比等高线作为辅助语言。避免音乐播放器、天气组件、热力图、宠物、悬浮工具栏和参考站品牌符号。

- [x] **Step 4: 校准玻璃和背景分层**

背景层只负责天空、雾海和环境光；岛屿层负责视觉锚点；面板层负责可读性。日间不使用纯白底，夜间不使用纯黑底，正文不落在高细节背景上。

### Task 4: 响应式、交互与降级

**Files:**

- Modify: `sketches/homepage/codex-independent-v1/index.html`

- [x] **Step 1: 添加响应式重排**

在约 `1180px` 收紧三栏，在约 `820px` 将 Hero 改为两段，在 `< 680px` 使用单列；移动端先展示身份和行动入口，再展示缩减后的心屿视觉与状态信息。

- [x] **Step 2: 添加克制交互**

主题按钮切换 `data-theme`；卡片 Hover 只改变边框、位移和局部光；键盘 Focus 使用清晰轮廓。原型不实现搜索、筛选、音频或复杂滚动劫持。

- [x] **Step 3: 支持 Reduced Motion**

在 `prefers-reduced-motion: reduce` 下关闭位移、缓动和持续环境动画，只保留即时主题颜色变化。

- [x] **Step 4: 验证无脚本内容**

删除或禁用脚本后，日间主题、全部正文、导航和链接仍直接可见；主题按钮即使无效也不阻挡页面使用。

### Task 5: 导出比较图并进行独立评审

**Files:**

- Create: `sketches/homepage/codex-independent-v1/codex-day-desktop.png`
- Create: `sketches/homepage/codex-independent-v1/codex-night-desktop.png`
- Create: `sketches/homepage/codex-independent-v1/codex-day-mobile.png`
- Modify: `tasks/active/homepage-prototype-v1.md`

- [x] **Step 1: 在浏览器中打开独立原型**

使用本地文件或静态服务器打开 `sketches/homepage/codex-independent-v1/index.html`，不启动生产 Astro 页面作为替代品。

- [x] **Step 2: 检查桌面日夜状态**

在约 `1600×1000` 视口检查完整页面节奏、内容遮挡、文字对比、面板层级与主题切换；分别导出日间和夜间长图。

- [x] **Step 3: 检查移动端**

在约 `390×844` 视口检查 Header、Hero、项目和博客顺序、横向溢出与触控尺寸；导出日间长图。

- [x] **Step 4: 自检比较标准**

逐项判断：身份是否在首屏清楚、Heart Island 是否是锚点、真实项目是否比装饰更突出、双主题是否同源、移动端是否自然、背景替换是否不会破坏布局。

- [x] **Step 5: 更新主任务并等待用户比较**

只勾选实际完成项目，记录原型路径和已知限制。不要宣称本方案胜出，也不要读取另一方案实现；由用户在两版均完成后并排评审。

## 验证命令

原型是隔离 HTML，不修改生产代码，因此本阶段不要求运行 Astro 全量构建。至少执行：

```powershell
rg -n "Davis Leo|22:48|天气|音乐|GitHub 热力|Agent Playground" sketches/homepage/codex-independent-v1/index.html
```

预期：无匹配，证明没有沿用参考图的虚构内容。

```powershell
rg -n "Galilieo|heart-island|AI Chat App|Galilieo Portfolio" sketches/homepage/codex-independent-v1/index.html
```

预期：四类真实身份与项目内容均有匹配。

视觉检查完成后记录浏览器、视口、主题、Reduced Motion 和无 JavaScript 结果。若后续选择该方案进入生产实现，再运行 `pnpm run lint`、`pnpm run check`、`pnpm run build` 和浏览器回归。

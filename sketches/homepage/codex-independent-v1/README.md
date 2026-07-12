# Codex Independent Homepage v1

概念：**潮汐观测站 / Tidal Observatory**

以 Heart Island 为视觉锚点，把项目、文章和成长记录组织成持续接收的“开发信号”与“航海日志”。日间是雾海中的开放观测台，夜间是深海中的低照度观测舱；两套主题共享相同的信息结构，不是两张互不相关的皮肤。

本目录由 Codex 独立设计。制作期间不读取或复用其他原型目录的 HTML、CSS、图片和设计说明，只使用项目已确认的需求、公共参考图和当前生产代码中的真实内容。

## 真实内容依据

- 身份与导航：`src/config/site.ts`
- 首页简介、当前探索与成长轨迹：`src/data/home.ts`
- 项目：
  - `src/content/projects/heart-island.md`
  - `src/content/projects/ai-chat-app.md`
  - `src/content/projects/galilieo-portfolio.md`
- 当前公开文章：
  - `src/content/blog/android-back-gesture-debugging.md`
  - `src/content/blog/heart-island-multi-turn-memory.md`
  - `src/content/blog/ionic-cached-tabs-scroll-container.md`
  - `src/content/blog/virtual-list-height-and-transform.md`

原型不增加时间、天气、音乐播放器、GitHub 热力图、虚构项目、虚构文章或无法从当前仓库追溯的统计数据。

## 设计方向

- 日间：暖骨白、雾蓝灰、低饱和石板蓝，表现清晨雾海和开放观测台。
- 夜间：深海蓝黑、靛蓝灰、月光紫蓝，表现低照度观测舱和远岸信号。
- 核心符号：潮位刻度、观测坐标、信号圆点、航海编号、低对比等高线。
- 页面结构：Header → Hero → Quick Overview → Featured Projects → Latest Blog → Archive Preview → About Preview → Footer。
- 响应式：移动端按身份、行动入口、心屿、当前状态、项目、文章的顺序重排，不缩小桌面仪表盘。

## 参考与原创边界

允许参考 Galilieo 既有日夜高保真图和 XingHuiSama 的日夜氛围、玻璃层次、背景分层、布局密度、响应式处理及动效方法。

本方案的“潮汐观测站”隐喻、内容组织、装饰符号、交互节奏和 HTML/CSS 实现独立完成。不把第三方头像、背景图、插画、Logo、文案和品牌表达作为生产内容。若未来直接复用具体代码或素材，必须另行核对许可证、署名与使用范围。

## 评审重点

1. 首屏能否快速说明 Galilieo 是谁、在做什么、从哪里查看项目与文章。
2. Heart Island 是否成为明确但不喧宾夺主的视觉锚点。
3. 项目和文章是否比装饰性组件更有信息价值。
4. 日间与夜间是否共享同一个品牌，而非简单反色。
5. 移动端是否自然、清楚，并保持主要链接可达。
6. 将来替换背景、岛屿和封面素材时，是否不需要重排页面结构。

## 当前验证

- Chrome 桌面 `1600×1000`：日间与夜间长图已导出，无横向溢出或控制台错误。
- Chrome 平板 `1024×768`：Hero 收为两栏，状态面板下移为三列，无横向溢出。
- Chrome 移动端 `390×844`：单列重排，Header 高度 `58px`，主要按钮高度 `46px`，无横向溢出。
- Reduced Motion：持续扫描动画被缩短至即时状态。
- 无 JavaScript：身份、Heart Island、项目、文章、导航与主要链接仍可见。

当前岛屿、背景纹理、头像和封面均是原型占位，不代表最终生产素材；移动端完整长图较长，是因为比较稿展示了全部首页区块，后续实现可通过更紧凑的内容摘要继续校准纵向节奏。

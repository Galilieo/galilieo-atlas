# 首页原型 v2.4 功能卡片与品牌收敛

- 状态：已完成并经用户确认（2026-07-11）
- 目标：在已确认的 `codex-luminous-archive-v2` 原型中加入 Galilieo Atlas 品牌、Hero 右侧功能卡片轨道和宽版个人资料联系卡，形成可确认的桌面日间方案。

## 范围

- 修改 `sketches/homepage/codex-luminous-archive-v2/index.html` 与同目录 `README.md`。
- 参考既有 Galilieo 高保真图的信息位置，以及 XingHuiSama 的模块化卡片、玻璃层级和响应式方法。
- 时间、天气、音乐和 GitHub 只做明确的高保真预留；不接 API、不播放音频、不伪造实时数据。
- 不修改 `src/`、心屿 SVG path、正式内容模型、依赖或生产配置。

## 步骤

- [x] 更新 Header、Hero 与页面元信息中的 Galilieo Atlas 品牌文案。
- [x] 将 Hero 右栏改为时间天气、音乐、GitHub 三张独立预留卡。
- [x] 将唯一的个人资料入口合并进 Hero，About Preview 只保留成长摘要与完整 About 入口。
- [x] 为 1024px 与 390px 设计自然重排，保留移动菜单和无 JavaScript 导航。
- [x] 导出 1440×1000 日间、夜间与移动端对照图并检查层级、溢出和控制台。
- [x] 运行 `node scripts/verify.mjs`，记录未验证项后等待用户确认。

## 验收

- Heart Island 仍是 Hero 中央主视觉，功能卡不能压过身份与岛屿。
- 所有预留模块明确显示未接入状态，控件不可误认为已经可用。
- 390px 下按身份、岛屿、两张小卡、整行音乐卡、后续内容的顺序展示。
- 浅色、深色、Reduced Motion、无 JavaScript和键盘移动菜单保持可用。

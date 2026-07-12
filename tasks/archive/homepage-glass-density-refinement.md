# 首页玻璃卡片与密度优化

- 状态：已完成（2026-07-12）
- 目标：在保留当前两行仪表盘、真实内容和 Heart Island 几何的前提下，参考 XingHuiSama 的通用玻璃分层原则，收紧卡片尺度并提升背景、遮罩和面板之间的景深。

## 范围

- 调整首页最大宽度、桌面列比例、卡片间距和垂直节奏。
- 调整日间/夜间面板透明度、边框、内高光、阴影、模糊和背景遮罩。
- 收紧 Profile、功能卡、项目/笔记轮播和状态条的尺寸。
- 维护桌面、平板、移动端、双主题、Reduced Motion 和无 JavaScript 状态。
- 在 `docs/homepage-redesign.md` 记录此次视觉校准与参考边界。

## 不修改范围

- 不改变首页两行信息架构、导航、文案、数据来源和轮播逻辑。
- 不修改 Heart Island SVG path、主体比例、水纹布局或动效语言。
- 不接入搜索、音乐、天气、GitHub 活跃度或第三方素材。
- 不复制 XingHuiSama 代码、精确色值、图片或品牌表达；不引入 React、Tailwind、Framer Motion、Three.js 等依赖。

## 实施步骤

1. 在 `src/styles/tokens.css` 建立双主题玻璃面板、边缘高光、阴影和背景遮罩 token。
2. 在 `src/styles/home/base.css` 重新平衡背景资源层与主题遮罩。
3. 在 `src/styles/home/hero.css` 收窄仪表盘、调整约 60:40 的主次比例，降低首行高度并统一面板材质。
4. 在 `src/styles/home/sections.css` 收紧两张轮播卡及其内部视觉高度。
5. 在 `src/styles/home/responsive.css` 保持平板和移动端自然降级，移动端降低模糊成本但保留可读性。
6. 更新 `docs/homepage-redesign.md`，记录设计来源、许可证边界和本次实现结果。
7. 运行格式化、`node scripts/verify.mjs`、`git diff --check`，再检查 1440×1000、1024×768、390×844 的日间/夜间页面截图、横向溢出和控制台错误。

## 验收

- 桌面首页内容宽度和卡片高度明显比当前紧凑，第二行在常见桌面首屏中更早出现。
- 日间卡片不再接近纯白实体块；夜间卡片不变成纯黑，背景透出但文字保持清晰。
- 主卡、次卡、媒体卡存在明确透明度层级，圆角、间距、边框和阴影节奏统一。
- 代表性视口无横向溢出；主题、键盘、Reduced Motion、无 JavaScript和 Astro 页面切换契约不退化。
- 自动验证通过，Heart Island 受保护几何未修改。

## 风险

- 背景素材授权仍待确认；此次只调整已有背景层，不改变发布边界。
- 玻璃效果依赖 `backdrop-filter`；不支持时以半透明背景和边框回退，移动端主动降低模糊成本。

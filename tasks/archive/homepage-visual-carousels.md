# 首页视觉轮播实施记录

## 目标与范围

将第二行项目与文章卡调整为统一的沉浸式视觉轮播：视觉铺满卡片，信息叠在底部渐变层，使用圆点切换并自动轮播。范围包括两个 Astro 组件、首页轮播 CSS、原生 TypeScript 生命周期和相关维护文档。

## 保持不变

- 首页两行结构与桌面约 `64:36` 比例。
- Content Collections schema、路由与真实内容。
- Heart Island SVG 路径、轮廓、水纹和动效语言。
- 不复制参考站图片、代码或品牌表达，不引入轮播库。

## 已完成

1. 项目与文章统一为全幅视觉卡，真实 `cover` 优先，缺失时使用 Heart Island 或 CSS 主题占位。
2. 删除可见前后按钮与页码，改为有可访问名称和当前状态的圆点按钮。
3. 使用原生 TypeScript 自动切换；悬停、焦点、后台页面和 Reduced Motion 时暂停，并随 Astro 页面切换清理。
4. 完成桌面、平板、移动端、双主题、键盘、无 JavaScript 和主要路由验收。

## 验证结果

- `node scripts/verify.mjs`：通过 lint、Astro check、build 和首页结构检查；Astro Check 为 0 errors、0 warnings、0 hints。
- Playwright：1440×1000、1024×768、390×844 无横向溢出；自动切换、暂停条件、圆点和方向键通过。
- 无 JavaScript：显示首项，隐藏圆点，核心链接可用。
- 静态预览：首页、项目、文章、RSS、sitemap 为 200，未知路径为 404。

## 剩余边界

当前项目与文章没有正式 `cover`，CSS 占位仅用于保持布局和视觉层级；后续补充真实素材时不重排卡片结构。

# Codex Homepage v2 · 雾海档案馆

## 核心方向

“雾海档案馆 / Luminous Island Archive”把首页当作一座建立在 Heart Island 周围的个人数字档案馆：梦境海岸负责第一眼氛围，编辑式档案结构负责真实内容，少量坐标与编号保留开发者身份。

它不是 v1“潮汐观测站”的换色版。v1 偏理性仪表盘和观测信号；v2 减少信息面板密度，增加留白、叙事、材质与场景光影。

## 视觉语言

- 日间：暖骨白、雾蓝、珍珠玻璃、清晨斜光。
- 夜间：深海蓝、月光紫蓝、低照度玻璃、极少量暖灯。
- 排版：大号编辑式衬线标题、易读无衬线正文、等宽档案编号。
- 玻璃层级：正文强面板、功能中面板、环境轻面板。
- 光影：心屿核心环境光、日夜全局光、Hover 边缘扫光三类。
- 动效：缓慢雾光、低振幅岛屿呼吸、短距离 Reveal 感、一次性卡片扫光。

## 不变量

- 首页顺序仍为 Header → Hero → Quick Overview → Featured Projects → Latest Blog → Archive Preview → About Preview → Footer。
- 所有身份、项目、文章、经历与统计来自当前生产配置或 Content Collections。
- 心屿主体引用 `src/assets/svg/island-reference-no-heart-vector.svg`，不修改 path，不增加心形图标。
- 时间、天气、音乐和 GitHub 只允许作为明确标注的未来功能卡位，不接 API、不自动播放、不显示虚构数据；不加入宠物或其他无关内容。
- 原型独立存在于本目录，不修改 `src/`，不覆盖 v1 或其他设计方案。

## 交互边界

- 主题切换只同步天空、海面、玻璃、文字、阴影和环境光。
- 卡片 Hover 最多上浮 `3px`，扫光只经过一次。
- Reduced Motion 停止循环、位移和扫光。
- 无 JavaScript 时默认日间主题，正文和链接保持可读。

## 验证结果

- Chrome `1600×1000`：日间、夜间完整长图，无横向溢出或控制台错误。
- Chrome `1024×768`：Hero 两栏、状态卡下移，无横向溢出。
- Chrome `390×844`：单列重排，Header `58px`，无横向溢出。
- 受保护心屿 SVG 在以上视口均成功加载。
- Reduced Motion 和无 JavaScript 状态可读。
- `node scripts/verify.mjs` 通过 ESLint、Astro check、静态构建和首页结构检查。

## v2.1 氛围强化

在不改变信息架构的前提下，参考 [XingHuiSama 线上首页](https://www.xinghuisama.top/) 与 [XinghuisamaBlogs 仓库](https://github.com/heiehiehi/XinghuisamaBlogs) 的背景、玻璃和日夜层次，增加：

- 可替换背景层、主题环境遮罩和独立玻璃内容层。
- `18px` 毛玻璃、饱和度增强、顶部内高光和多层阴影。
- 12 个低速环境光点、雾层漂移和精细指针背景视差。
- 页面隐藏暂停、Reduced Motion 静止和无 JavaScript 内容回退。
- 主题、面板、边框、阴影和环境光的连续过渡。

没有复制其播放器、天气、弹幕、宠物、图片、文案或 React 组件。参考仓库采用 CC BY-NC 4.0；本原型只提炼通用设计方法，若未来直接复用具体代码或素材必须另行核对许可与署名。

## v2.2 紧凑排版

- 缩小 Hero、状态卡、快捷卡、项目卡和文章卡的高度与内边距。
- 下调展示标题、正文、标签和元数据字号，保持衬线标题与等宽编号的层级关系。
- Hero 左右信息卡改为垂直居中，避免与中央心屿产生不必要的错位。
- 项目封面统一改成明确的 `PROJECT COVER / PLACEHOLDER` 占位；后续生成或设计正式封面时只替换视觉区，不重排卡片内容。

## v2.3 移动导航

- `820px` 以下保留品牌与主题按钮，并增加独立的导航菜单按钮，不再直接隐藏页面跳转入口。
- 菜单使用原生按钮与导航语义；打开后焦点进入首项，`Escape` 关闭并把焦点还给菜单按钮，选择链接后自动收起。
- JavaScript 不可用时隐藏无效菜单按钮，五个导航链接直接显示，保证移动端仍可跳转。

## v2.4 品牌与功能卡片预留

- 品牌更新为 `Galilieo Atlas`，短句使用 `Works · Notes · Explorations`；Atlas 是内容容器，不约束具体项目命名。
- Hero 左侧成为页面唯一的个人入口卡：整卡进入 About 摘要，Works、Notes、GitHub、Email 与 Heart Island 保留独立链接。
- Hero 右侧保留时间/天气、音乐和 GitHub 三张模块化卡片；当前只确认布局和材质，实时数据、音乐来源和 API 均未接入。
- 移动端将天气与 GitHub 并排，音乐卡占整行；无横向滚动或隐藏功能入口。
- 页面底部 About 只展示实习、heart-island 持续开发和软件工程学习的成长摘要，不重复个人名片。

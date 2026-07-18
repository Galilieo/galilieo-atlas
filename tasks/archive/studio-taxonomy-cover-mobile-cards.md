# Studio 受控分类标签、封面图库与移动卡片优化

## 目标

按用户最终批准并在实机反馈后收敛的 B 方向完善本地 Galilieo Studio：主分类只能单选并留在设置抽屉/新建弹窗内，标签只能从已有允许项多选，封面可选择自动图库、指定图库或上传专属封面；标签与封面使用摘要行和底部选择面板。移动博客目录改为双列图片索引，首页精选与项目卡保持单列。

## 范围

- Studio API 返回受控封面图库和文章自动封面键。
- Studio API 只允许选择固定图库键或恢复自动封面，不接受任意路径。
- Studio 设置抽屉和新建草稿直接显示主分类单选；标签与封面从摘要触发器进入底部选择面板。
- Studio 封面选择面板展示自动封面、图库缩略图与专属上传。
- 580px 以下博客目录改为 B 原型的双列图片索引；首页精选与项目卡保持单列，项目卡标题同步收敛。
- 同步 Studio 单元/UI 契约测试、内容指南和设计指南。

## 不修改范围

- 不改变 Content Collections schema 与现有 Markdown 字段。
- 不引入数据库、CMS、线上写接口或自动部署。
- 不修改首页整体布局、首页精选文章的单列大图结构、心屿 SVG/动效。
- 不复制 XingHuiSama 代码、素材或视觉资产。
- 不升级依赖，不提交、不推送、不部署。

## 实施步骤

- [x] RED：扩展 `tests/blog-studio/server.test.mjs`，覆盖图库列表、静态缩略图、合法图库选择、自动封面恢复、非法 key 拒绝。
- [x] GREEN：在 `scripts/lib/blog-studio-server.mjs` 中从固定 `src/assets/images/covers/` 目录扫描 `scene-*.webp`，提供只读资源与受控 PUT 接口；复用与站点一致的稳定封面映射。
- [x] RED：扩展 Studio UI 契约测试，要求分类单选、标签选择、封面图库，禁止 category/tags 自由 authoring 文本框。
- [x] GREEN：修改 `tools/blog-studio/index.html`、`studio.js`、`studio.css`，实现分类容器内单选及标签/封面底部选择面板，并覆盖新建草稿流程、恢复副本、保存与 MDX 只读状态。
- [x] 调整 `src/styles/interior.css` 的 580px 博客目录：双列卡、约 16px/三行标题、隐藏摘要/标签/footer、保留紧凑分类日期；项目标题单独收敛。
- [x] 更新 `docs/content-guide.md`、`docs/design-guide.md`，说明受控 taxonomy、封面模式和移动卡片规则。
- [x] 验证真实 Studio 的分类、标签、自动/图库/上传入口、只读、焦点与预览；上传写盘、保存和发布路径由隔离临时仓库 server tests 覆盖，不修改真实文章。验证站点 390px 浅色/深色与无横向溢出。
- [x] 运行 focused tests、`pnpm run verify`、`git diff --check`。
- [x] 独立审查最终实现与范围，处理结论后归档。

## 验证结果

- `node --test tests/blog-studio/*.test.mjs`：65 passed，0 failed。
- `node scripts/verify.mjs`：lint、Astro check、build、博客/首页契约、Studio tests、生产隔离全部通过。
- 390×844 CDP：页面 `scrollWidth = clientWidth = 390`；文章网格为 `176px 176px`、`10px` gap，图片高 `100px`，标题 `16px` / 三行，浅色与深色截图通过视觉检查。
- 600px CDP：博客完整信息卡为 `564px` 单列且无溢出；390px 项目目录为 `362px` 单列，首页精选文章 carousel 仅一张可见。
- Studio CDP：分类面板当前项 `aria-pressed` 正确；Tab / Shift+Tab 焦点循环、Escape 关闭与焦点返回通过；运行时异常 0。
- 独立审查：完整候选与最终 760/580 断点增量均无 blocking、无 medium；保留“切换封面后不自动删除旧上传文件”和“空仓库首篇分类引导”两项非阻塞 LOW，不为个人静态站扩张清理流程。
- 实机反馈修正：移除覆盖写作区的分类底部面板；分类改为设置侧边栏/新建弹窗内两列紧凑单选，选择即生效。

## 验收

- 分类 UI 不可输入任意新值；每篇恰好一个分类。
- 标签搜索只过滤已有标签；可多选，至少一个。
- 封面支持自动图库、指定图库和专属上传；同篇首页/博客仍同图。
- API 无法选择任意路径或非图库文件。
- 390px 博客目录保持双列，单卡约 175px 宽，标题最多三行、字号约 16px，一屏可扫描约四篇且无横向溢出；首页精选文章仍是单列大图。
- 完整 verify 通过，生产 dist 不包含 Studio。

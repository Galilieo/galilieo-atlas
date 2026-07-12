# 轻量 AI 开发 Harness 落地计划

- **状态：** Completed — `pnpm run verify`、项目 Skills 与 Agent 入口已落地
- **目标：** 在不修改业务功能和既定视觉的前提下，为 Astro 作品集增加一个简短 Agent 入口、统一验证命令和三个项目 Skill。

## 当前问题

- 已有 `AGENTS.md` 和三份项目指南，但尚未连接项目 Skill 与统一 `verify`。
- 没有项目级 Skill。
- lint、Astro check 和 build 需要分别运行。
- 当前工作区已有其他未提交修改，Harness 必须严格限制文件范围。

## 修改范围

- `AGENTS.md`
- `docs/content-guide.md`、`docs/deployment.md`（只把分散质量命令改为统一 `verify`）
- `package.json`
- `scripts/verify.mjs`
- `.agents/skills/portfolio-content/SKILL.md`
- `.agents/skills/portfolio-ui-change/SKILL.md`
- `.agents/skills/pre-release-check/SKILL.md`
- 本计划文件

## 不修改的范围

- `src/` 业务、视觉、内容与素材
- Astro、TypeScript、ESLint、Prettier 配置
- 依赖与 lockfile
- 正式域名、Nginx 配置和生产环境
- 当前根目录研究缓存

## 实施步骤

1. 在 `AGENTS.md` 增加 Skill 索引、任务计划规则、Hermes/Codex 分工和统一验证入口。
2. 用跨平台 Node 脚本依次运行现有 lint、check、build。
3. 创建三个短小、项目专属且互不重复的 Skill。
4. 运行格式检查、Skill 结构检查和 `pnpm run verify`。
5. 使用独立只读 Agent 审查 Harness diff，不让其修改文件。

## 验收条件

- `pnpm run verify` 任一步失败即非零退出，成功时依次通过 lint、check、build。
- 三个 Skill 均能指向真实文件和真实命令。
- `AGENTS.md` 保持简短，不复制三份指南。
- 没有业务代码、依赖、部署或生产配置变化。

## 风险

- Windows Git Bash 的 Corepack pnpm shim 存在路径转换问题；`verify.mjs` 需要支持直接用 Node 执行。
- 当前工作区不是干净基线；最终报告必须只归属本计划列出的文件。
- 无 JavaScript Reveal 当前存在已知限制，验证结果不得误报为通过。

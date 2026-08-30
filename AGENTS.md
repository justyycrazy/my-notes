# AGENTS.md

> 说明：本文档根据项目实际代码与配置整理，供 AI 编码助手快速了解本项目。

## 项目概述

本项目是一个基于 **Astro 7** 的静态个人博客/笔记站点，站点名称为《荒田半亩》，目标域名 `https://www.yycrazy.net`。项目采用纯静态输出（`output: 'static'`），文章以 Markdown 形式管理，通过 Astro Content Layer 加载并进行类型校验，最终生成可在任意静态托管服务部署的 HTML。

## 技术栈

- **框架**：Astro `^7.0.3`，输出模式为 `static`
- **运行时/构建**：Node.js `>=22.12.0`，包管理器为 **pnpm**（存在 `pnpm-lock.yaml` 与 `pnpm-workspace.yaml`）
- **样式**：Tailwind CSS `^4.3.1`，通过 `@tailwindcss/vite` 与 Vite 插件接入，主样式入口 `src/styles/global.css`
- **字体**：通过 `unplugin-fonts` 加载 Google Fonts（Noto Serif SC、Zhi Mang Xing）
- **类型**：TypeScript，使用 `astro/tsconfigs/strict` 严格配置
- **Markdown 增强**：
  - 数学公式：`remark-math` + `rehype-katex`
  - 图表：`rehype-mermaid`（构建时借助 Playwright 渲染 Mermaid 为 inline SVG）
  - 代码块：`astro-expressive-code` + 行号插件
- **SEO/结构化数据**：`astro-seo`、`astro-seo-schema`、`schema-dts`
- **资源优化**：`@playform/compress`（CSS 使用 lightningcss 压缩，避开 csso 对 Tailwind v4 媒体查询语法的兼容问题）、`sharp`

## 目录结构

```
.
├── astro.config.mjs          # Astro 主配置
├── package.json              # 脚本与依赖
├── pnpm-lock.yaml            # pnpm 锁定文件
├── pnpm-workspace.yaml       # pnpm workspace 配置
├── tsconfig.json             # TypeScript 配置
├── public/static/            # 静态资源（favicon、webmanifest 等）
├── src/
│   ├── assets/               # 图片、脚本（theme.js、avatar 等）
│   ├── components/           # Astro 组件
│   │   ├── articles/         # 文章相关：ArticleHeader、ArticleBody、ArticleFooter、PostCard
│   │   ├── decorations/      # 装饰组件：Seal、InkDivider、BrushIcon、ThemeToggleSeal
│   │   ├── effects/          # 动效：FadeInSection、PaperBackground
│   │   └── sections/         # 页面区块：Navbar、Hero、RecentPosts、Contact、Footer
│   ├── content/              # 内容数据（仅占位；权威内容在 my-vault 的 src-content/，部署时整体被软链接管，勿在本仓库增删文章）
│   │   ├── categories.yaml   # 分类定义
│   │   ├── tags.yaml         # 标签定义
│   │   ├── drafts/           # 草稿目录（被 TypeScript 与 gitignore 排除）
│   │   ├── pending/          # 待发布文章
│   │   └── published/        # 已发布文章
│   ├── content.config.ts     # Content Layer 集合定义与 Zod schema
│   ├── consts.ts             # 站点常量（标题、描述、导航、社交链接）
│   ├── env.d.ts              # import.meta.env 类型
│   ├── layouts/              # 布局：BaseLayout、ListLayout
│   ├── pages/                # 路由页面
│   ├── styles/global.css     # 全局 Tailwind / 自定义样式
│   └── utils/                # 工具函数：url、date、number、category
└── dist/                     # 构建产物（静态站点）
```

## 内容模型

`src/content.config.ts` 定义了 4 个集合：

- `categories`（`src/content/categories.yaml`）：分类，字段 `title`、`description`、`order`、`parent`（支持层级）
- `tags`（`src/content/tags.yaml`）：标签，字段 `title`、`description`
- `pending`（`src/content/pending/**/*.md`）：待发布文章
- `published`（`src/content/published/**/*.md`）：已发布文章

文章 frontmatter schema（`postSchema`）：

```yaml
slug: "article-slug"                # 必填，URL 标识
title: "文章标题"                   # 必填
author: "颜晏"                      # 默认值为 consts.ts 中的 DEFAULT_AUTHOR
createTime: "2025-01-01 00:00:00"   # 日期，会被强制转为 Date
updateTime: "2025-01-02 00:00:00"
category: "my-category"             # 引用 categories
tags: ["my-tag"]                    # 可选，引用 tags 数组
description: "摘要"                 # 可选
password: "secret"                  # 可选，当前仅作为元数据保留，未实现访问控制
```

`slug.astro` 会同时读取 `pending` 与 `published`，若 slug 冲突则 `published` 优先。

## 构建与运行命令

项目使用 pnpm，核心脚本在 `package.json` 中：

```bash
# 安装依赖
pnpm install

# 开发服务器（默认 http://localhost:4321）
pnpm dev

# 类型检查
pnpm check

# 类型检查 + 生产构建，输出到 dist/
pnpm build

# 预览构建产物
pnpm preview
```

> 注意：`rehype-mermaid` 在构建时可能依赖 Playwright 渲染图表。如果构建报错缺少浏览器，可执行 `pnpm exec playwright install` 安装 Chromium。

## 代码风格与约定

- **语言**：UI 文案、注释以简体中文为主。
- **组件**：使用 `.astro` 单文件组件；客户端脚本优先使用 `is:inline`，并在 `astro:page-load` / `astro:before-swap` 等事件中处理 View Transitions 生命周期。
- **样式**：
  - Tailwind v4 语法：`@import "tailwindcss"`、`@theme`、`@utility`、`@layer`
  - 主题色通过 CSS 自定义属性定义（如 `--color-paper`、`--color-ink`、`--color-cinnabar`）
  - 深色/浅色模式通过 `html[data-theme="dark"]` 切换
- **路由/URL**：
  - 站点 `base: '/'`，`trailingSlash: 'never'`，`build.format: 'preserve'`
  - URL 统一通过 `src/utils/url.ts` 的 `getFullURL` / `getPostURL` 生成
- **图片**：使用 `astro:assets` 的 `<Image />` 组件（如 Hero 头像），静态资源放入 `public/static/`
- **常量**：站点级常量集中在 `src/consts.ts`（标题、描述、作者、导航、社交链接）

## 测试说明

- 当前项目**没有配置自动化测试脚本**（无 `tests/` 目录、无 `*.test.*` / `*.spec.*`）。
- 主要质量保障方式：
  - `pnpm check` 进行 Astro + TypeScript 类型检查
  - `pnpm build` 验证构建是否通过
  - `pnpm preview` 手动预览并核对页面
- `playwright` 已作为开发依赖安装，但当前仅用于 `rehype-mermaid` 的服务端 SVG 渲染；如需补充 E2E 测试，可基于 Playwright 自行添加配置。

## 部署

- 输出为纯静态站点，构建产物位于 `dist/`。
- 生产环境目标域名为 `https://www.yycrazy.net`（配置于 `astro.config.mjs`）。
- 将 `dist/` 上传至任意静态托管服务（如 Vercel、Cloudflare Pages、GitHub Pages、Nginx 等）即可。
- **实际生产部署**由同级仓库 `my-vault/` 的脚本完成（Ubuntu 部署机）：`update-my-notes.sh` 将本仓库强制对齐远端 main/master 并放弃全部本地变更，`build.sh` 随后在本地 `build` 分支上软链绑定内容、安装依赖（`--frozen-lockfile`）并构建。流程与运维纪律详见 my-vault 的 README.md。
- **build 分支与预期 git 状态**：部署态下本仓库处于本地 `build` 分支（随每次更新丢弃重建，不向 main/master 同步）；`src/content`、`public/robots.txt` 与 `src/assets/images/` 下若干子目录被 my-vault 软链接管，`git status` 会长期显示"跟踪文件被删除 + 未跟踪软链"——这是**预期状态**，切勿用 `git checkout -- .`、`git restore` 等手段"修复"，否则会破坏软链绑定。

## 安全注意事项

- **CSP**：`BaseLayout.astro` 中硬编码了 Content-Security-Policy，限制 `default-src 'self'`，并允许 `'unsafe-inline'` 的脚本与样式。新增外部脚本/字体/连接源时，需要同步更新 CSP，否则会被浏览器拦截。
- **外部链接**：`Contact.astro` 中的社交链接通过 `isExternalLink` 判断，外部链接会自动添加 `target="_blank" rel="noopener noreferrer"`。
- **主题持久化**：使用 `localStorage.setItem('theme', ...)` 记录用户主题偏好，读取失败时优雅回退到系统偏好。不会存储敏感信息。
- **密码字段**：文章 schema 包含可选 `password` 字段，但代码中尚未实现任何访问控制或加密逻辑。若未来需要密码保护，必须在服务端/构建前完成校验与加密，不能依赖 frontmatter 明文。
- **依赖构建权限**：`pnpm-workspace.yaml` 中允许了 `esbuild` 与 `sharp` 的 postinstall 构建；安装依赖时会执行原生编译，建议在受信任环境中操作。

## 其他提示

- `src/content/drafts/` 被 `.gitignore` 与 `tsconfig.json` 同时排除，适合存放未完成的草稿。
- 分类支持层级：`parent` 引用另一个分类；`[id].astro` 会递归聚合子分类下的文章。
- 代码块默认显示行号、不自动换行；可在 `astro.config.mjs` 的 `expressiveCode` 配置中调整。
- View Transitions 已启用（`<ClientRouter />`），并自定义了水墨风格的过渡动画；`Navbar` 通过 `transition:persist="navbar"` 保持跨页面不重新渲染。

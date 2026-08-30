# 荒田半亩

个人博客与笔记站点，基于 Astro 7 构建，以纯静态形式输出。

## 技术栈

- **框架**：Astro `^7.0.3`
- **样式**：Tailwind CSS `^4.3.1`
- **字体**：Google Fonts（Noto Serif SC、Zhi Mang Xing）
- **类型**：TypeScript（`astro/tsconfigs/strict`）
- **增强**：KaTeX 数学公式、Mermaid 图表、Expressive Code 代码块
- **SEO**：astro-seo、astro-seo-schema

## 目录结构

```
.
├── astro.config.mjs
├── package.json
├── src/
│   ├── components/      # Astro 组件
│   ├── content/         # 文章与分类/标签数据
│   ├── layouts/         # 页面布局
│   ├── pages/           # 路由页面
│   ├── styles/          # 全局样式
│   └── utils/           # 工具函数
├── public/static/       # 静态资源
└── dist/                # 构建产物
```

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm check

# 生产构建
pnpm build

# 预览构建产物
pnpm preview
```

## 部署

本项目输出纯静态站点，构建产物位于 `dist/` 目录。将 `dist/` 上传至任意静态托管服务（如 Vercel、Cloudflare Pages、GitHub Pages 等）即可。

本站的实际生产部署由同级仓库 [my-vault](../my-vault) 的脚本完成：Ubuntu 部署机上更新内容并强制对齐本仓库远端 main/master 后，在本地 `build` 分支上软链绑定内容并构建。详见 my-vault 的 README.md。

## 备注

- 文章内容存放于 `src/content/published/`（已发布）与 `src/content/pending/`（待发布）。注意：本仓库内的 `src/content/` 仅为占位（两个 yaml 与空目录），**权威内容在 my-vault 仓库的 `src-content/`**，写作与发布流转在 my-vault 进行，部署时 `src/content` 整体被软链接管——请勿直接在本仓库增删文章。
- 部署态下本仓库处于本地 `build` 分支（随每次更新丢弃重建），`git status` 长期显示被接管文件的"删除"与未跟踪软链，属预期状态，不要"修复"。
- 若构建时报错缺少浏览器，请执行 `pnpm exec playwright install` 安装 Chromium，以支持 Mermaid 图表渲染。

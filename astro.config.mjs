// @ts-check
import { defineConfig } from 'astro/config';

import Unfonts from 'unplugin-fonts/astro';

import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';

import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

import playformCompress from '@playform/compress';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://www.yycrazy.net',
    base: '/',
    build: {
        format: 'preserve',
    },
    trailingSlash: 'never',
    output: 'static',
    markdown: {
        syntaxHighlight: false,
        processor: unified({
            remarkPlugins: [remarkMath],
            // rehype-mermaid 的 inline-svg 策略在构建时渲染固定颜色，
            // 不支持运行时双主题切换（dark 选项在 inline-svg 下被忽略）。
            // 暗色模式通过 global.css 中的 CSS filter 反相适配。
            rehypePlugins: [rehypeKatex, [rehypeMermaid, { strategy: 'inline-svg' }]],
        }),
    },

    integrations: [Unfonts({
        google: {
            preconnect: true,
            display: 'swap',
            families: [
                {
                    name: 'Noto Serif SC',
                    styles: 'wght@400;700',
                    defer: false,
                },
                {
                    name: 'Zhi Mang Xing',
                    styles: 'wght@400',
                    defer: true,
                },
            ],
        },
    }), expressiveCode({
        themes: ['solarized-light', 'solarized-dark'],
        useDarkModeMediaQuery: false,
        themeCssSelector: (theme) => `[data-theme="${theme.name}"]`,
        customizeTheme: (theme) => {
            theme.name = theme.name === 'solarized-light' ? 'light' : 'dark';
        },
        plugins: [pluginLineNumbers()],
        frames: {
            showCopyToClipboardButton: true,
        },
        defaultProps: {
            showLineNumbers: true,
            wrap: false,
        },
    }), playformCompress({
        // csso 无法解析 Tailwind v4 使用的 Media Queries Level 4 区间语法
        // （@media (width >= 48rem)），会丢弃整个媒体查询块，导致 md: 等响应式
        // 断点样式全部丢失。改用 lightningcss（原生支持该语法）进行 CSS 压缩。
        CSS: {
            csso: false,
            lightningcss: { minify: true },
        },
    })],

    vite: {
        plugins: [tailwindcss()],
        build: {
            assetsInlineLimit: 0,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules/katex')) return 'katex';
                    },
                },
            },
        },
    },
});
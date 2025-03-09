import { defineConfig } from 'vitepress'
import { themeConfig } from './themeConfig'
import { viteConfig } from './viteConfig'

import { createRssFile } from "./utils/rss"; // 引入 RSS 文件生成函数


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "HKeBus",
  description: "A VitePress Site",
  themeConfig: themeConfig,
  vite: viteConfig,
  base: '/HKebus',
  markdown: {
    math: true
  },

  buildEnd: createRssFile, // 在 build 结束后生成 RSS 文件
})

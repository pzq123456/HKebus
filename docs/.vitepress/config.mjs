import { defineConfig } from 'vitepress'
import { themeConfig } from './themeConfig'
import { viteConfig } from './viteConfig'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "HKebus",
  description: "A VitePress Site",
  themeConfig: themeConfig,
  vite: viteConfig,
  base: '/HKebus',
})

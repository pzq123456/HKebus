import path from 'path'

// element-plus auto import
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export const viteConfig = {
    resolve: {
      alias: 
        {
          '@': path.resolve(__dirname,'..', 'src'),
        }
    },

    // 优化 esbuild 打包 用于支持 commonjs 模块
    // 需要安装 vite-plugin-commonjs 插件
    // https://www.npmjs.com/package/vite-plugin-commonjs
    // optimizeDeps: {
    //   esbuildOptions: {
    //     target: 'esnext', // 确保支持最新的 ES 特性
    //   },
    // },

    // plugins: [
    //   // ...
    //   // AutoImport({
    //   //   resolvers: [ElementPlusResolver()],
    //   // }),
    //   // Components({
    //   //   resolvers: [ElementPlusResolver()],
    //   // }),
    // ],

    // // fix build error : 
    // // - https://github.com/vuejs/vitepress/issues/2915#issuecomment-1719080940
    // // - https://stackblitz.com/edit/vite-gjz9zf?file=docs%2F.vitepress%2Fconfig.ts
    // ssr: {
    //   noExternal: ['test-design-vue', 'element-plus'],
    // },

    // build-fix: https://github.com/plouc/nivo/issues/2602
    // ssr: {
    //   noExternal: [/^@deck.gl.*$/, /^@mapbox.*$/],
    // },
}




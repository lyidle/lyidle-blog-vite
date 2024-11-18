export default {
  rollupOptions: {
    // 打包时排除的目录
    external: new RegExp("/mock/*"),
    // 输出
    output: {
      // 入口文件名
      entryFileNames: "static/js/[name]-[hash].js",
      // 块文件名
      chunkFileNames: "static/js/[name]-[hash].js",
      // 手动分块
      manualChunks: {
        echarts: ["echarts"],
      },
      // 资源文件名
      assetFileNames: (assetInfo: any) => {
        // css
        if (assetInfo.name.endsWith(".css")) {
          return "static/css/[name].[hash][extname]"
        }
        // 图片
        if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
          return "static/images/[name].[hash][extname]"
        }
        // 字体
        if (/\.(ttf|woff|woff2|eot)$/.test(assetInfo.name)) {
          return "static/fonts/[name].[hash][extname]"
        }
        // 其他
        return "static/other/[name].[hash][extname]"
      },
    },
  },
}

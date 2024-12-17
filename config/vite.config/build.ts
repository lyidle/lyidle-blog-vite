export default {
  outDir: "lyidle-blog-node/src/static",
  assetsDir: "assets",
  emptyOutDir: true,
  rollupOptions: {
    // 输出
    output: {
      // 入口文件名
      entryFileNames: "assets/js/[name]-[hash].js",
      // 块文件名
      chunkFileNames: "assets/js/[name]-[hash].js",
      // 手动分块
      // 资源文件名
      assetFileNames: (assetInfo: any) => {
        // css
        if (assetInfo.name.endsWith(".css")) {
          return "assets/css/[name].[hash][extname]"
        }
        // 图片
        if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
          return "assets/images/[name].[hash][extname]"
        }
        // 字体
        if (/\.(ttf|woff|woff2|eot)$/.test(assetInfo.name)) {
          return "assets/fonts/[name].[hash][extname]"
        }
        // 其他
        return "assets/other/[name].[hash][extname]"
      },
    },
  },
}

import { BuildOptions } from "vite"

export default {
  outDir: "lyidle-blog-node/src/static/dist",
  assetsDir: "assets",
  emptyOutDir: true,
  rollupOptions: {
    // 输出
    output: {
      // 手动分块
      // manualChunks(id) {
      //   if (id.includes("node_modules")) {
      //     // 让每个插件都打包成独立的文件
      //     return id
      //       .toString()
      //       .split("node_modules/")[1]
      //       .split("/")[0]
      //       .toString()
      //   }
      // },
      // 入口文件名
      entryFileNames: "assets/js/[name]-[hash].js",
      // 块文件名
      chunkFileNames: "assets/js/[name]-[hash].js",
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
} as BuildOptions

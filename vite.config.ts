// vite.config.ts
import { defineConfig, loadEnv } from "vite"
// node 进行文件相关操作
import { resolve } from "path"
// 引入 打包相关配置
import build from "./config/vite.config/build"
// 引入 插件相关配置
import plugin from "./config/vite.config/plugin"
// 引入 scss  全局 变量 配置函数
import generateScssImports from "./config/vite.config/scss"

export default defineConfig(({ mode }) => {
  // 获取到当前环境
  const env = loadEnv(mode, process.cwd())
  return {
    // 静态路径
    publicDir: "public",
    // 打包配置
    build: build,
    // 插件
    plugins: plugin(),
    resolve: {
      alias: {
        // @别名
        "@": resolve(__dirname, "src"),
        public: resolve(__dirname, "public"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // javascriptEnabled: true,
          // scss全局变量的配置
          additionalData: generateScssImports(
            resolve(__dirname, "src/styles/variable")
          ),
          sassOptions: { quietDeps: true },
          api: "modern-compiler",
        },
      },
    },
    // 代理跨域
    server: {
      // https: {
      //   key: fs.readFileSync("certs/certkey.pem"),
      //   cert: fs.readFileSync("certs/fullchain.pem"),
      // },
      proxy: {
        // 运行时的反代配置
        [env.VITE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          // 替换 /api/assets node后就是node的静态路径
          rewrite: (path) =>
            path.replace(new RegExp(`^${env.VITE_API + "/assets"}`), ""),
        },
      },
    },
  }
})

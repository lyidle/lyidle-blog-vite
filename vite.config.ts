// vite.config.ts
import { defineConfig, loadEnv } from "vite"
// node 进行文件相关操作
import { resolve } from "path"
// 引入 打包相关配置
import build from "./config/vite.config/build"
// 引入 插件相关配置
import plugin from "./config/vite.config/plugin"
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
          // scss全局变量的配置
          // javascriptEnabled: true,
          additionalData: '@use "@/styles/variable.scss" as *;',
          sassOptions: { quietDeps: true },
          api: "modern-compiler",
        },
      },
    },
    // // 代理跨域
    // server: {
    //   // https: {
    //   //   key: fs.readFileSync("certs/certkey.pem"),
    //   //   cert: fs.readFileSync("certs/fullchain.pem"),
    //   // },
    //   proxy: {
    //     // 运行时的反代配置
    //     [env.VITE_API]: {
    //       target: env.VITE_SERVE,
    //       changeOrigin: true,
    //       // rewrite: (path) =>
    //       //   path.replace(new RegExp(`^${env.VITE_API}`), ""),
    //     },
    //   },
    // },
  }
})

# 搭建博客

## 初始化前端框架

```ts
📦lyidle-blog-vite
 ┣ 📂config
 ┃ ┗ 📂vite.config
 ┃ ┃ ┣ 📜build.ts
 ┃ ┃ ┗ 📜plugin.ts
 ┣ 📂public
 ┃ ┗ 📂static
 ┃ ┃ ┣ 📂cursor
 ┃ ┃ ┃ ┣ 📂dark
 ┃ ┃ ┃ ┗ 📂light
 ┃ ┃ ┣ 📂font
 ┃ ┃ ┗ 📂images
 ┃ ┃ ┃ ┗ 📜vite.svg
 ┣ 📂src
 ┃ ┣ 📂api
 ┃ ┣ 📂assets
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂icon
 ┃ ┣ 📂directive
 ┃ ┣ 📂hooks
 ┃ ┣ 📂layout
 ┃ ┃ ┗ 📜index.vue
 ┃ ┣ 📂router
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜routes.ts
 ┃ ┣ 📂store
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂styles
 ┃ ┃ ┣ 📜global.scss
 ┃ ┃ ┗ 📜variable.scss
 ┃ ┣ 📂utils
 ┃ ┃ ┣ 📜debounce.ts
 ┃ ┃ ┣ 📜localStorage.ts
 ┃ ┃ ┣ 📜request.ts
 ┃ ┃ ┣ 📜throttle.ts
 ┃ ┃ ┗ 📜zh-moment.ts
 ┃ ┣ 📂views
 ┃ ┃ ┗ 📂404
 ┃ ┃ ┃ ┗ 📜index.vue
 ┃ ┣ 📜App.vue
 ┃ ┣ 📜main.ts
 ┃ ┣ 📜plugins.ts
 ┃ ┗ 📜vite-env.d.ts
 ┣ 📜.env.development
 ┣ 📜.env.production
 ┣ 📜.env.test
 ┣ 📜.gitignore
 ┣ 📜index.html
 ┣ 📜package.json
 ┣ 📜pnpm-lock.yaml
 ┣ 📜tsconfig.app.json
 ┣ 📜tsconfig.json
 ┣ 📜tsconfig.node.json
 ┣ 📜uno.config.ts
 ┗ 📜vite.config.ts
```

> [!abstract]
>
> 1. 使用 `normalize.css` 初始化样式
> 2. 使用 `unocs、@iconify/json、@unocss/preset-icons` 实现图标使用 `class` 按需加载
> 3. 配置自动按需导入 `unplugin-auto-import、unplugin-vue-components、unplugin-element-plus、element-plus` 实现 `component` 下的组件便捷导入，`element-plus` 的按需加载
>    * `element-plus` 主要是 `btn、select` 等方便封装改变颜色
> 4. 配置快速命名组件 `vite-plugin-vue-setup-extend` 在 `setup` 中使用 `name=“componentName”` 来命名
> 5. 预配置 `axios` 进行封装发起请求、`lodash` 的深度克隆等、`moment` 实现时间快速格式化、`pinia` 实现仓库管理

### vite.config.ts

> [!abstract]  `vite` 配置文件

```ts
// vite.config.ts
import { defineConfig, loadEnv } from "vite"
// node 进行文件相关操作
import { resolve } from "path"
import fs from "fs"
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
    // 代理跨域
    server: {
      https: {
        key: fs.readFileSync("certs/certkey.pem"),
        cert: fs.readFileSync("certs/fullchain.pem"),
      },
      proxy: {
        // 运行时的反代配置
        // [env.VITE_AUTH_API]: {
        //   target: env.VITE_AUTH_SERVE,
        //   changeOrigin: true,
        //   rewrite: (path) =>
        //     path.replace(new RegExp(`^${env.VITE_AUTH_API}`), ""),
        // },
        // [env.VITE_MANAGER_API]: {
        //   target: env.VITE_MANAGER_SERVE,
        //   changeOrigin: true,
        //   rewrite: (path) =>
        //     path.replace(new RegExp(`^${env.VITE_MANAGER_API}`), ""),
        // },
      },
    },
  }
})

```

### config/vite.config/plugin.ts

> [!abstract]  `vite` 的插件配置

```ts
import vue from "@vitejs/plugin-vue"
// setup 扩展，用来定义组件名
import VueSetupExtend from "vite-plugin-vue-setup-extend"
// 自动导入
import AutoImport from "unplugin-auto-import/vite"
// 自动导入组件
import Components from "unplugin-vue-components/vite"
// 按需引入element-plus
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
// element-plus样式
import ElementPlus from "unplugin-element-plus/vite"
// UnoCSS
import UnoCSS from "unocss/vite"

export default () => {
  return [
    vue(),
    UnoCSS(),
    // setup name
    VueSetupExtend(),
    AutoImport({
      // 自动导入的插件
      imports: [
        // vue相关的 如ref onMounted等
        "vue",
        // 路由 如 useRoute useRouter等
        "vue-router",
        // 仓库 如 createPinia等
        "pinia",
      ],
      // 生成  auto-imports.d.ts文件
      dts: true,
      resolvers: [
        // 按需引入element-plus
        ElementPlusResolver(),
      ],
    }),
    // 按需引入element-plus样式
    ElementPlus({}),
    Components({
      //imports指定组件所在目录，默认为src/components
      // dirs: ["src/components"],
      // 生成 components.d.ts文件
      dts: true,
      resolvers: [
        // element-plus解析器
        ElementPlusResolver(),
      ],
      // 开启命名空间 以components下的文件为前缀
      directoryAsNamespace: true,
    }),
  ]
}

```

### config/vite.config/build.ts

> [!abstract]  `vite` 打包配置

```ts
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

```

### main.ts

> [!abstract]  `vite` 入口文件配置

```ts
import { createApp } from "vue"
import App from "./App.vue"
import plugins from "@/plugins"
const app = createApp(App)
app.use(plugins)
app.mount("#app")

```

### src/plugins.ts

> [!abstract]  统一管理插件

```ts
// element-plus切换暗夜模式
import "element-plus/theme-chalk/dark/css-vars.css"
// router
import router from "@/router/index"
// 引入仓库
import pinia from "@/store"
// UnoCss
import "virtual:uno.css"
// 重置样式
import "normalize.css"
// 引入全局样式
import "@/styles/global.scss"
export default {
  // 安装插件
  install(app: any) {
    // 安装仓库
    app.use(pinia)
    // 安装路由
    app.use(router)
  },
}

```

### 初始化 路由

### src/router/index.ts

> [!abstract]  路由文件入口

```ts
import { createRouter, createWebHistory } from "vue-router"
import { constantRoute, anyRoute } from "@/router/routes"
export default createRouter({
  history: createWebHistory(),
  routes: [...constantRoute, ...anyRoute],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

```

### src/router/routes.ts

> [!abstract]  路由文件
>
> 定义基本的路由框架

```ts
// 常量路由
export const constantRoute = [
  {
    path: "/",
    name: "index",
    redirect: "home",
  },
  {
    path: "/home",
    name: "Home",
    meta: { title: "首页" },
    component: () => import("@/layout/index.vue"),
  },
  {
    path: "/404",
    name: "404",
    meta: { title: "404" },
    component: () => import("@/views/404/index.vue"),
  },
]
// 任意路由
export const anyRoute = [
  {
    path: "/:pathMatch(.*)*",
    meta: { hidden: true },
    redirect: "/404",
  },
]
// 异步路由 需要权限判断的
export const asyncRoute = []
```


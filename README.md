# 搭建博客心得

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
> 1. 使用 `normalize.css` + `scss` 初始化样式
> 2. 使用 `unocs、@iconify/json、@unocss/preset-icons` 实现图标使用 `class` 按需加载
> 3. 配置自动按需导入 `unplugin-auto-import、unplugin-vue-components、unplugin-element-plus、element-plus` 实现 `component` 下的组件便捷导入，`element-plus` 的按需加载
>    * `element-plus` 主要是 `button、switch` 等方便封装改变颜色
>    * 自动导入 `components` 下的组件
> 4. 配置快速命名组件 `vite-plugin-vue-setup-extend` 在 `setup` 中使用 `name=“componentName”` 来命名
> 5. 预配置 `axios` 进行封装发起请求、`lodash` 的深度克隆等、`moment` 实现时间快速格式化、`pinia` 实现仓库管理

## 参考

> [!abstract]  界面参考
>
> [Fomalhaut](https://www.fomal.cc/)

> [!abstract]  组件参考
>
> [登录组件]()

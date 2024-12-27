// element-plus切换暗夜模式
import "element-plus/theme-chalk/dark/css-vars.css"
// router
import router from "@/router/index"
// 引入仓库
import pinia from "@/store"
// UnoCss
import "virtual:uno.css"
// 动态图标
import "@/components/icon/unocss"
// 重置样式
import "normalize.css"
// 引入全局样式
import "@/styles/reset.scss"
export default {
  // 安装插件
  install(app: any) {
    // 安装仓库
    app.use(pinia)
    // 安装路由
    app.use(router)
  },
}

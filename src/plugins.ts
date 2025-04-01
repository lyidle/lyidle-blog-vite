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
// 引入 vditor 样式
import "vditor/dist/index.css"
// 引入 自定义指令
import directives from "@/directive"
// 引入仓库
import { useUserStore } from "@/store/user"
import { useSettingStore } from "@/store/setting"
// 重试 次数
let tryCounts: number | null = 0
const maxCounts = 5
export default {
  // 安装插件
  install(app: any) {
    // 安装仓库
    app.use(pinia)
    // 处理 访客
    const { addTourist } = useUserStore()
    const { isLoading } = storeToRefs(useSettingStore())
    isLoading.value = true
    const recur = () => {
      ++(tryCounts as number)
      if ((tryCounts as number) > maxCounts) {
        ElMessage.error("加载页面失败")
        // 安装路由
        app.use(router)
        // 安装自定义指令
        app.use(directives)
        app.mount("#app")
        tryCounts = null
        return
      }
      // 防止游客没有访客id
      addTourist().then(
        () => {
          // 等待 访客 请求 完毕后 再 挂载 其他东西
          // 安装路由
          app.use(router)
          // 安装自定义指令
          app.use(directives)
          app.mount("#app")
          isLoading.value = false
        },
        (error) => {
          console.log(`重试次数：${tryCounts}`, error)
          ElMessage.error(`重试次数：${tryCounts}`)
          recur()
        }
      )
    }
    recur()
  },
}

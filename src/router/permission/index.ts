// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入类型
import type { Router } from "vue-router"

export const usePermission = (router: Router) => {
  // 监听 Not Found 事件
  mitt.on("NotFound", (data) => {
    console.log("404 路由错误信息:", data)
    // 可在此跳转到 404 页面
    router.push("/404")
  })
  router.beforeEach((to, from, next) => {
    next()
  })
  return router
}

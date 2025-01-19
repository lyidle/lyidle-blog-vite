import type { Router } from "vue-router"
import { routerEventHandlered } from "./eventHandlers"
import { mitt } from "@/utils/emitter"

/**
 * 配置权限控制逻辑
 * @param router - Vue Router 实例
 */

export const usePermission = (router: Router) => {
  // 配置事件处理
  routerEventHandlered(router)

  router.beforeEach((to, from, next) => {
    // 如果路由发生变化 则触发 router changed 事件
    if (to !== from) mitt.emit("router changed")
    next()
  })
  return router
}

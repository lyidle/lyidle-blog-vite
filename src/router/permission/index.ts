// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 类型
import type { Router } from "vue-router"
// 引入 错误处理 mitt 监听
import { routerEventHandlered } from "./eventHandlers"
// 引入 初始化 菜单
import { initMenuList } from "./initMenuList"
// 引入 处理异步路由 问题 的函数
import { handlerAsyncRoutes } from "./handlerAsyncRoutes"
// 引入 处理 常量路由的 权限
import { handlerConstRoutes } from "./handlerConstRoutes"
// 引入 设置title 的函数
import { setTitle } from "./setTitle"
import { useSettingStore } from "@/store/setting"
/**
 * 配置权限控制逻辑
 * @param router - Vue Router 实例
 */

export const usePermission = (router: Router) => {
  // 配置事件处理
  routerEventHandlered(router)
  router.beforeEach(async (to, from, next) => {
    const { isLoading } = storeToRefs(useSettingStore())
    isLoading.value = true
    // 异步路由的加载 需要再 路由加载后才能处理 加载404问题
    await initMenuList()
    // 处理常量路由的 权限问题
    handlerConstRoutes(to, from, router)

    // 处理 异步路由 没加载时 404 问题
    handlerAsyncRoutes(to, from, router)

    // 设置title
    const title = to.meta.title
    setTitle(title)

    // 设置 欢迎词
    if (to.meta.replaceWel && to.meta.bannerWel) {
      const template = to.meta.bannerWel as string
      // 替换 :param 为 params 或 query 的值
      to.meta.bannerWel = template.replace(/:(\w+)/g, (_, key) => {
        // 优先找 params，再找 query
        return (
          to.params[key]?.toString() || to.query[key]?.toString() || `:${key}`
        )
      })
    }

    next()
    // 如果路由发生变化 则触发 router changed 事件
    if (to !== from)
      setTimeout(() => {
        mitt.emit("router changed", { to, from })
      }, 100)
  })
  router.afterEach(() => {
    const { isLoading } = storeToRefs(useSettingStore())
    isLoading.value = false
  })
  return router
}

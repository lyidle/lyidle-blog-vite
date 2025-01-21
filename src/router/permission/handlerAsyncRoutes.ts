// 引入 仓库 使用白名单
import { useUserStore } from "@/store/user"
// 引入类型
import type {
  RouteLocationNormalized,
  NavigationGuardNext,
  _RouteLocationBase,
} from "vue-router"
/* 
    处理异步路由重定向到404问题
*/
export const handlerAsyncRoutes = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): boolean | void => {
  const { whitelist, routes } = storeToRefs(useUserStore())
  // 处理 异步路由重定向到404的问题
  if (to.name === "404") {
    if (!to.redirectedFrom) return
    // 发生重定向的地址
    const redirect = to.redirectedFrom?.path
    const path = to.redirectedFrom.path
    const query = to.redirectedFrom.query
    if (!redirect) return
    // 再白名单则放行到对应的路由中
    if (routes.value?.length && whitelist.value.includes(redirect)) {
      next({ path, query, replace: true })
      return true
    }
  }
}

// 引入类型
import type {
  RouteLocationNormalized,
  NavigationGuardNext,
  _RouteLocationBase,
} from "vue-router"
// 引入 仓库 role
import { useUserStore } from "@/store/user"
export const handlerConstRoutes = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): boolean | void => {
  // 提取数据
  const { userRole } = storeToRefs(useUserStore())
  if (!to.meta.role) return
  if (!Array.isArray(to.meta.role)) {
    console.error("路由的role，需要是一个数组~")
    return
  }
  // 判断是否有权限
  const isAccess = to.meta.role.find((item) => userRole.value.includes(item))
  // 没有 通过权限判断
  if (!isAccess) {
    next("/")
    ElMessage.warning(`访问当前页面需要${to.meta.role}权限~`)
    return true
  }
}

// 引入类型
import type {
  RouteLocationNormalized,
  _RouteLocationBase,
  Router,
} from "vue-router"
// 引入 仓库 roles
import { useUserStore } from "@/store/user"
export const handlerConstRoutes = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  router: Router
): boolean | void => {
  // 提取数据
  const { userRoles, userPermissions, userToken } = storeToRefs(useUserStore())
  // 判断 是否需要登录
  if (to.meta.isLogin) {
    if (!userToken.value) {
      ElMessage.warning(`访问当前页面需要登录哦~`)
      router.push({ path: "/login", replace: true })
      return
    }
  }

  if (!to.meta.roles) return
  if (!Array.isArray(to.meta.roles)) {
    console.error("路由的role，需要是一个数组~", to.meta.roles)
    return
  }
  // 判断是否有角色
  const isAccess = to.meta.roles?.find((item) => userRoles.value.includes(item))
  // 判断 是否有 权限
  const isAccessPermissions = (to.meta.permissions as string[])?.find((item) =>
    userPermissions.value.includes(item)
  )
  // 没有 通过 角色、权限 判断
  if (!isAccess && !isAccessPermissions) {
    router.push({ path: "/", replace: true })
    ElMessage.warning(
      `访问当前页面需要 ${to.meta.roles} ${
        (isAccess && "角色") || (isAccessPermissions && "权限")
      }~`
    )
  }
}

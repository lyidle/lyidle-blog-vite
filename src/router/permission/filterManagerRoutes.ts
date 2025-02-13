import { RouteRecordRaw } from "vue-router"
import { asyncRoute } from "../routes"
// 引入 仓库
import { useUserStore } from "@/store/user"

// 过滤 出 白名单中的路由
const filterRoutes = (routes: RouteRecordRaw[], whitelist: string[]) => {
  const recur = (routes: RouteRecordRaw[]) => {
    return routes
      .map((item) => {
        // 判断是否包含路径
        if (whitelist.includes(item.path)) {
          // 判断是否存在 children
          if (item.children?.length) {
            // 存在 递归调用
            const children = recur(item.children)
            // children 结果 有则加入结果
            if (children.length) {
              item.children = children
            }
          }
          return item
        }
        return false
      })
      .filter(Boolean) as RouteRecordRaw[]
  }
  return recur(routes)
}

export const filterManagerRoutes = () => {
  // 找到本地 名字 为 Admin 的路由
  const findManager = asyncRoute?.find((item) =>
    (item.name as string).includes("Admin")
  )?.children
  const routes = findManager?.length ? findManager : []
  // 返回结果
  let result: RouteRecordRaw[] = []

  // 存在 过滤
  if (routes.length) {
    // 提取变量
    const { whitelist } = storeToRefs(useUserStore())
    // 过滤出在白名单中的路由
    result = filterRoutes(routes, whitelist.value)
  }
  return result
}

// 引入 类型
import type { RouteRecordRaw } from "vue-router"

/**
 * 使用 callback 可以处理 路由的 每一项的 配置
 * @param $routes 路由
 * @param callback 回调函数
 * @param callback.item 路由的 每一项
 * @returns
 */
export const handlerRoutes = (
  $routes: RouteRecordRaw[],
  callback?: (item: RouteRecordRaw) => void
) => {
  const cur = (routes: RouteRecordRaw[]) => {
    routes.map((item) => {
      callback?.(item)
      if (item.children?.length) cur(item.children)
    })
  }
  cur($routes)
  return $routes
}

/**
 * 处理菜单项，隐藏banner和header，并添加admin角色
 * @param item 菜单项
 */
export const processMenuItem = (item: any): void => {
  // 确保meta对象存在
  if (!item.meta) {
    item.meta = {}
  }

  // 隐藏 banner
  if (!item.meta.bannerHidden) {
    item.meta.bannerHidden = true
  }

  // 隐藏 header
  if (!item.meta.headerHidden) {
    item.meta.headerHidden = true
  }

  // 处理roles
  const roles = item.meta.roles as string[] | undefined
  // 添加admin角色
  if (!roles?.includes("admin")) {
    if (roles?.length) {
      roles.push("admin")
    } else {
      item.meta.roles = ["admin"]
    }
  }

  // 递归处理子项
  if (item.children && Array.isArray(item.children)) {
    item.children.forEach((child: any) => processMenuItem(child))
  }
}

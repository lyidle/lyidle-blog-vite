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

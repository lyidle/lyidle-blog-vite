// 引入类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"
import { RouteRecordRaw } from "vue-router"
// 引入 使用的异步路由
import { asyncRoute } from "@/router/routes"
// 深度克隆
import { cloneDeep } from "lodash-es"

// 过滤出 需要的路由信息
export const filterRoutes = (
  menuList: GetMenuList["data"]
): { _whitelist: string[]; _routes: RouteRecordRaw[] } => {
  // 提取所有 `to` 路径（包括子菜单）
  const toPathsSet = new Set<string>()
  menuList?.forEach((menu) => {
    if (menu.to) toPathsSet.add(menu.to)
    menu.children?.forEach((child) => {
      if (child.to) toPathsSet.add(child.to)
    })
  })

  // 得到处理后的结果
  const toPaths = Array.from(toPathsSet)
  toPathsSet.clear()

  // 判断是否以路径 结果 开头
  const isStartWith = (data: string) =>
    toPaths.find((item) => item.startsWith(data))

  // 递归匹配路由
  const filterRoutes = (routes: RouteRecordRaw[]) => {
    return (
      routes
        .map((route) => {
          if (isStartWith(route.path)) {
            // 有children 递归
            if (route.children?.length) {
              route.children = filterRoutes(route.children)
            }
            // 存在 返回路由
            return route
          }
          return null
        })
        // 过滤空的
        .filter(Boolean) as RouteRecordRaw[]
    )
  }

  // 过滤后的路由
  const filteredRoutes = filterRoutes(cloneDeep(asyncRoute))

  // 过滤 掉 有 redirect 且 children.path没有包含路径的
  const resultRoutes = filteredRoutes
    .map((item) => {
      if (
        item.redirect &&
        !item.children?.find(($item) => $item.path.includes(item.path))
      ) {
        return false
      }
      return item
    })
    .filter(Boolean) as RouteRecordRaw[]

  // 白名单
  const whiteListSet = new Set()

  resultRoutes.forEach((item) => {
    whiteListSet.add(item.path)
    item.children?.forEach(($item) => {
      whiteListSet.add($item.path)
    })
  })

  // 生成白名单
  const whiteList = Array.from(whiteListSet) as string[]

  return { _whitelist: whiteList, _routes: resultRoutes }
}

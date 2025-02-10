// 引入类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"
import { RouteRecordRaw } from "vue-router"
// 引入 使用的异步路由
import { asyncRoute } from "@/router/routes"
// 深度克隆
import { cloneDeep } from "lodash-es"

// 提取出 服务器返回菜单的 所有的to
const handlerAllTos = (menus: GetMenuList["data"]) => {
  // 提取所有 `to` 路径（包括子菜单）
  const toPathsSet = new Set<string>()
  const recur = (menus: GetMenuList["data"]) => {
    menus?.forEach((item) => {
      // 存在to
      if (item.to) {
        toPathsSet.add(item.to)
      }
      // 判断是否有children
      if (item.children) {
        // 递归处理children
        recur(item.children)
      }
    })
  }
  recur(menus)
  const allTos = Array.from(toPathsSet)
  toPathsSet.clear()
  return allTos
}

// 判断 本地异步路由的 路径是否存在
const isExistPath = (item: RouteRecordRaw) =>
  (item.path as string) || (item.redirect as string) || ""

// 过滤出以 路径开头的
const isStartWith = (path: string, match: string[]) =>
  match.find((item) => item.startsWith(path))

// 过滤出 匹配 AllTos 的路由
const filterAllTosRoutes = (routes: RouteRecordRaw[], toPaths: string[]) => {
  const recur = (routes: RouteRecordRaw[]) => {
    return routes
      .map((item) => {
        // 路径存在
        const path = isExistPath(item)
        // 匹配上了返回的 to
        if (isStartWith(path, toPaths)) {
          // children存在
          if (item.children?.length) {
            const children = recur(item.children)
            if (children.length) {
              item.children = children
            }
          }
          // 返回匹配结果
          return item
        }
        return false
      })
      .filter(Boolean) as RouteRecordRaw[]
  }
  return recur(routes)
}
// 过滤 掉 有 redirect 且 children.path没有包含路径的
const filterNotRedirect = (routes: RouteRecordRaw[]) => {
  return routes
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
}

// 递归 处理 白名单结果
const filterWhiteList = (routes: RouteRecordRaw[]) => {
  const whiteList = new Set<string>()

  // 递归辅助函数
  const recur = (routes: RouteRecordRaw[]) => {
    return routes.forEach((item) => {
      const path: string =
        (item.path as string) || (item.redirect as string) || ""
      // 过滤出有路径的
      if (path) {
        whiteList.add(path)
        // 递归过滤出有 children的
        if (item.children?.length) {
          recur(item.children)
        }
      }
      return false
    })
  }
  // 调用递归辅助函数
  recur(routes)

  return Array.from(whiteList) as string[]
}

// 过滤出 需要的路由信息
export const filterRoutes = (
  menuList: GetMenuList["data"]
): { _whitelist: string[]; _routes: RouteRecordRaw[] } => {
  //  调用提取出 服务器返回菜单的 所有的to 得到处理后的结果
  const toPaths = handlerAllTos(menuList)

  // 过滤出 匹配 AllTos 的路由
  const filteredRoutes = filterAllTosRoutes(cloneDeep(asyncRoute), toPaths)

  // 过滤 掉 有 redirect 且 children.path没有包含路径的
  const resultRoutes = filterNotRedirect(filteredRoutes)

  // 生成白名单
  const whiteList = filterWhiteList(resultRoutes)

  return { _whitelist: whiteList, _routes: resultRoutes }
}

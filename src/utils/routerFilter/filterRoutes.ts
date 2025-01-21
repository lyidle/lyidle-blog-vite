// 引入类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"
import { RouteRecordRaw } from "vue-router"
// 引入 使用的异步路由
import { asyncRoute } from "@/router/routes"
// 引入 lodash
import { cloneDeep } from "lodash-es"

// 过滤出 需要的路由信息
export const filterRoutes = (
  menuList: GetMenuList["data"]
): { _whitelist: string[]; _routes: RouteRecordRaw[] } => {
  let result = new Map<number, RouteRecordRaw>()
  // 当没有加载路由时 会出现 跳转404的情况
  // 保存过滤出的路径信息 制作白名单
  let route = new Set<string>()

  // 过滤出有权限访问的路由 需要本地写了的
  asyncRoute.forEach((item, i) => {
    // 处理 有children 的
    const asyncChildren = item.children
    if (asyncChildren) {
      // 把有children 的添加到结果中 去除children
      const _result = cloneDeep(item)
      delete _result.children
      // 初始化 children
      _result.children = []
      result.set(i, _result)
      // 遍历 异步路由的children
      asyncChildren.forEach((syncitem) => {
        const asyncChildrenPath = syncitem.path
        // 遍历 服务端返回的数据 判断是否包含当前的路径
        const filter = menuList?.find(($item) =>
          $item.children?.find((_item) => _item.to.includes(asyncChildrenPath))
        )
        if (filter) {
          const stack = result.get(i)
          if (stack?.children) {
            // 把当前项添加到children中
            stack.children.push(syncitem)
            // 添加白名单
            route.add(syncitem.path)
          }
        }
      })
      return
    }

    // 处理 没有 children 且有 path
    const path = item.path
    if (path) {
      // 添加到路由中
      result.set(i, item)
      // 添加白名单
      route.add(path)
    }
  })

  // 得到白名单信息
  const whitelist = Array.from(route)

  const routes = Object.fromEntries(result)

  const resultRoutes: RouteRecordRaw[] = []
  // 添加路由
  for (const i in routes) {
    const item = routes[i]
    resultRoutes.push(item)
  }

  // 释放 route 和 result
  route.clear()
  result.clear()
  return { _whitelist: whitelist, _routes: resultRoutes }
}

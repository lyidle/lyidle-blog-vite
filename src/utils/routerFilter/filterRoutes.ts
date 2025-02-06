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
      asyncChildren.forEach((syncitem, $i) => {
        const asyncChildrenPath = syncitem.path
        // 遍历 服务端返回的数据 判断是否包含当前的路径
        const filter = menuList?.find(
          ($item) =>
            // $item.children?.find((_item) => _item.to?.includes(asyncChildrenPath))
            $item.children?.find((_item) =>
              _item.to?.includes(asyncChildrenPath)
            ) ||
            (item.path && $item.to?.includes(item.path))
        )
        if (filter) {
          const stack = result.get(i)
          if (stack?.children) {
            // 把当前项添加到children中
            stack.children.push(syncitem)
            // 添加白名单
            route.add(asyncChildrenPath)
          }
        }

        // 最后处理完毕 最后一项
        if ($i === asyncChildren.length - 1) {
          const $result = Object.fromEntries(result)
          for (const key in $result) {
            const _item = $result[key]
            // 如果children 是空 的 则表示 没有children加入进来
            if (!_item.children?.length) {
              // 有 redirect 直接删除
              if (item.redirect) {
                result.delete(+key)
                continue
              }

              // 判断 主路由的路径 是否和服务器返回的相符
              const isDelete = !!menuList?.find((item) =>
                item.to?.includes(_item.path)
              )

              // 包含
              if (isDelete) {
                // 包含的添加到白名单
                route.add(_item.path)
              }

              // 不包含的
              // 删除对应的那项
              if (!isDelete) result.delete(+key)
            }
          }
        }
      })
      return
    }

    // 处理 没有 children 且有 path 且没有 redirect 的
    const path = item.path

    if (path && !item.redirect) {
      // 遍历 服务端返回的数据 判断是否包含当前的路径
      const filter = menuList?.find(($item) => $item.to?.includes(path))
      if (!filter) return
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

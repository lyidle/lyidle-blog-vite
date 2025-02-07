// 引入类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"

export const filterUserMenuList = (
  menuList: GetMenuList["data"],
  whitelist: string[]
): GetMenuList["data"] => {
  // 过滤出在白名单中的 用户菜单
  const filterMenuList = (menus: GetMenuList["data"]) => {
    return (
      menus &&
      menus.map((item) => {
        // 过滤出白名单中的 菜单
        if (item.to && whitelist.includes(item.to)) {
          // 有children 递归
          if (item.children?.length) {
            item.children = filterMenuList(item.children)
          }
          return item
        }
        return null
      })
    )?.filter(Boolean) as GetMenuList["data"]
  }
  return filterMenuList(menuList)
}

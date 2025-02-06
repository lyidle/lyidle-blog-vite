// 引入类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"
export const filterUserMenuList = (
  whitelist: string[],
  userMenuList: GetMenuList["data"]
) => {
  // 过滤出白名单中有的数据 服务端返回的 菜单中 children.to 包含在白名单中的信息的菜单
  const result1 = userMenuList?.filter((item) =>
    item.children?.find(($item) => whitelist.includes($item.to))
  )
  const result2 = userMenuList?.filter((item) => {
    // children为空 且标题 链接 存在
    const to = item.to
    if (!item.children?.length && to) {
      return whitelist.includes(to)
    }
  })

  const result = Array.from(
    new Set([result1, result2].flat(Infinity))
  ) as GetMenuList["data"]

  return result
}

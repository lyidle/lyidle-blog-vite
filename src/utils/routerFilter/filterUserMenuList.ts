// 引入类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"
export const filterUserMenuList = (
  whitelist: string[],
  menuList: GetMenuList["data"]
) => {
  // 过滤出白名单中有的数据 服务端返回的 菜单中 children.to 包含在白名单中的信息的菜单
  const result1 = menuList?.filter((item) =>
    item.children?.find(($item) => $item.to && whitelist.includes($item.to))
  )

  // 过滤出白名单中有的数据 服务端返回的 菜单中 item.to 包含在白名单中的信息的菜单
  const result2 = menuList
    ?.map((item) => {
      if (item.to && whitelist.includes(item.to)) {
        delete item.children
        return item
      }
    })
    .filter((item) => item)

  const result = [] as GetMenuList["data"]
  const test = [] as GetMenuList["data"]
  // 汇总结果 children 处理的 放到 result2 中
  result1?.forEach((item) => {
    const find = result2?.find(
      ($item) => item.to && $item?.to?.includes(item.to)
    )
    if (find) {
      find.children = item.children
      console.log(find)
      // test.push(find)
      return
    }
    console.log(item)
    // test.push(item)
  })

  return result
}

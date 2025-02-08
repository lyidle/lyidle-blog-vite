/* 
    过滤出用户的 banner设置信息
*/
// 引入类型
import type {
  GetMenuList,
  Datum,
  PurpleBannerImg,
} from "@/api/admin/types/getMenuList"

export type filterBannerReturnType = {
  [key in string]: PurpleBannerImg
}

// 判断 是否通过 白名单
const isAccess = (item: Datum, whitelist: string[]) => {
  return (
    !item.to ||
    !item.bannerImg ||
    !Object.keys(item.bannerImg).length ||
    !whitelist.includes(item.to)
  )
}

const recur = (data: GetMenuList["data"], whitelist: string[]) => {
  const maxHeightMap = new Map<string, null | PurpleBannerImg>()
  const recursive = (data: GetMenuList["data"], whitelist: string[]) => {
    data?.forEach((item) => {
      // ts 没有判断到
      if (isAccess(item, whitelist)) return

      const to = item.to!

      const oldHeight = maxHeightMap.get(to)?.height

      // 值不存在 保存
      if (!oldHeight) {
        maxHeightMap.set(to, item.bannerImg!)
      }

      // 旧值存在 且小于新值 修改
      if (
        oldHeight &&
        parseFloat(`${oldHeight}`) < parseFloat(`${item.bannerImg?.height}`)
      )
        maxHeightMap.set(to, item.bannerImg!)
      // 有children递归
      if (item.children) {
        return recursive(item.children, whitelist)
      }
      return
    })
  }
  recursive(data, whitelist)
  const result = Array.from(maxHeightMap).reduce((pre, cur) => {
    const result: { [key in string]: PurpleBannerImg } = {}
    const obj = cur[1]
    if (obj) {
      result[cur[0]] = obj
    }
    return result
  }, {})

  maxHeightMap.clear()
  return result
}

export const filterBanner = (
  result: GetMenuList["data"],
  whitelist: string[]
): filterBannerReturnType => {
  // 返回 焦点图信息
  return recur(result, whitelist)
}

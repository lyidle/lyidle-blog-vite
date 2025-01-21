/* 
    过滤出用户的 banner设置信息
*/
// 引入类型
import type {
  GetMenuList,
  PurpleBannerImg,
} from "@/api/admin/types/getMenuList"

// 定义banner 信息 设置过滤的类型
type filterBannerType = (result: GetMenuList["data"]) => {
  [key in string]: PurpleBannerImg
}

export const filterBanner: filterBannerType = (result) => {
  // 用户的焦点图信息 map
  let bannerImgMap = new Map<string, PurpleBannerImg>()
  // 用户的路由路径 set
  let routeSet = new Set<string>()
  // 过滤出路径
  result?.forEach((item) => {
    if (item.to) {
      routeSet.add(item.to)
      if (item.bannerImg) bannerImgMap.set(item.to, item.bannerImg)
    }
    if (item.children)
      item.children.forEach((item) => {
        if (item.to) {
          routeSet.add(item.to)
          if (item.bannerImg) bannerImgMap.set(item.to, item.bannerImg)
        }
      })
  })
  const _result = Object.fromEntries(bannerImgMap)
  // 清除 临时数据
  routeSet.clear()
  bannerImgMap.clear()
  // 返回 焦点图信息
  return _result
}

/* 
    过滤出用户的 banner设置信息
*/
// 引入类型
import type {
  GetMenuList,
  PurpleBannerImg,
} from "@/api/admin/types/getMenuList"

export type filterBannerReturnType = {
  [key in string]: PurpleBannerImg
}

export const filterBanner = (
  result: GetMenuList["data"],
  whitelist: string[]
): filterBannerReturnType => {
  // 返回 焦点图信息
  return (
    (result &&
      // 把通过的键值对数组 转为 filterBannerReturnType 格式 对象
      (Object.fromEntries(
        result
          .flatMap((item) => [item, ...(item.children || [])]) // 展平数据
          .filter(
            ({ to, bannerImg }) =>
              to &&
              bannerImg &&
              Object.keys(bannerImg).length &&
              whitelist.includes(to)
          ) // 过滤符合条件的项
          .map(({ to, bannerImg }) => [to!, bannerImg]) // 转换为键值对数组
      ) as filterBannerReturnType)) ||
    ({} as filterBannerReturnType)
  )
}

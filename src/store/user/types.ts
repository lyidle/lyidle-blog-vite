// 引入类型
import type {
  GetMenuList,
  PurpleBannerImg,
} from "@/api/admin/types/getMenuList"

// 定义类型
export type userRouteType = Ref<string[]>
export type userBannerImgType = Ref<{ [key in string]: PurpleBannerImg }>
export type userMenuListType = GetMenuList["data"]

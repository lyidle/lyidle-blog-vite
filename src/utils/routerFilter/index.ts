// 引入类型
// 引入类型
import type {
  GetMenuList,
  PurpleBannerImg,
} from "@/api/admin/types/getMenuList"
import { RouteRecordRaw } from "vue-router"
// 引入 过滤banner 的函数
import { filterBanner } from "./filterBanner"
// 引入 过滤白名单和添加异步路由的函数
import { filterRoutes } from "./filterRoutes"
// 引入 根据白名单过滤 用户菜单的函数
import { filterUserMenuList } from "./filterUserMenuList"

type routesFilterReturn = {
  _userBannerImg: { [key in string]: PurpleBannerImg }
  _whitelist: string[]
  _userMenuList: GetMenuList["data"]
  _routes: RouteRecordRaw[]
}

/**
 * 过滤用户可用的路由，并根据权限和白名单生成用户菜单与相关的横幅图片。
 *
 * @param result - 后端返回的完整路由列表（包含所有路由数据）。
 * @param whitelist - 用户的路由白名单，表示用户有权限访问的路由路径集合。
 * @param userBannerImg - 一个 Ref 对象，用于存储用户特定的横幅图片信息。
 * @param userMenuList - 用于存储生成的用户菜单路由列表。
 *
 * 该函数会：
 * 1. 根据白名单过滤掉用户无权限访问的路由。
 * 2. 提取符合条件的路由并更新用户的菜单路由列表。
 * 3. 根据路由生成对应的横幅图片数据并存储在 userBannerImg 中。
 */
export const userStoreRoutesFilter = (
  result: GetMenuList["data"],
  role: Ref<string[]>
): routesFilterReturn => {
  // 过滤出 需要的异步路由信息 并添加白名单
  const { _whitelist, _routes } = filterRoutes(result)

  // 过滤出用户的菜单信息
  const _userMenuList = filterUserMenuList(result, _whitelist)
  // 过滤出用户的 banner 信息设置
  const _userBannerImg = filterBanner(result, _whitelist)
  // 返回处理完毕的信息
  return { _userBannerImg, _whitelist, _userMenuList, _routes }
}

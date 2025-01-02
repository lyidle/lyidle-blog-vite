import request from "@/utils/request"
// 引入类型
/* 
  set的最后是携带的参数类型
*/
import type { GetMenuList } from "@/api/admin/types/getMenuList"
import type { GetAnnounce } from "@/api/admin/types/getAnnounce"
import type { SetAnnounce } from "@/api/admin/types/setAnnounce"
import type { SetAnnounceBody } from "@/api/admin/types/setAnnounceBody"
import type { SetMenuList } from "@/api/admin/types/setMenuList"
import type { SetMenuListBody } from "@/api/admin/types/setMenuListBody"
import type { GetPoetry } from "@/api/admin/types/getPoetry"

// 统一管理 api
enum API {
  menuList = "/admin/menuList",
  announce = "/admin/announce",
  poetry = "/admin/poetry",
  webInfo = "/webinfo",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 获取菜单
export const getMenuList = () =>
  request.get<any, GetMenuList["data"]>(server + prefix + API.menuList)
// 设置菜单
export const setMenuList = (data: SetMenuListBody) =>
  request.post<any, SetMenuList>(server + prefix + API.menuList, { data })

// 获取公告
export const getAnnounce = () =>
  request.get<any, GetAnnounce["data"]>(server + prefix + API.announce)
// 设置公告
export const setAnnounce = (data: SetAnnounceBody) =>
  request.put<any, SetAnnounce>(server + prefix + API.announce, { data })

// 获取短诗
export const getPoetry = () =>
  request.get<any, GetPoetry["data"]>(server + prefix + API.poetry)

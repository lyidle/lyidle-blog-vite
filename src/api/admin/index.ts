import request from "@/utils/request"
// 引入类型
import { reqMenuListType } from "@/api/user/type"

// 统一管理 api
enum API {
  menuList = "/admin/menuList",
  announce = "/admin/announce",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 获取菜单
export const reqMenuList = () =>
  request.get<any, reqMenuListType>(server + prefix + API.menuList)
// 获取公告
export const reqAnnounce = () =>
  request.get<any, any>(server + prefix + API.announce)

import request from "@/utils/request"
// 引入类型
import { GetWebInfo } from "@/api/webInfo/types/getWebInfo"

// 统一管理 api
enum API {
  menuList = "/admin/menuList",
  announce = "/admin/announce",
  poetry = "/admin/poetry",
  webInfo = "/webinfo",
  tourist = "/visitor",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 获取小站资讯
export const getWebInfo = () =>
  request.get<any, GetWebInfo["data"]>(server + prefix + API.webInfo)
// 增加访客
export const reqAddTourist = () =>
  request.get<any, string>(server + prefix + API.tourist)
// 删除访客
export const reqDelTourist = (name: string) =>
  request.delete<any, string>(server + prefix + API.tourist, { data: { name } })

import request from "@/utils/request"
// 引入类型
/* 
  set的最后是携带的参数类型
*/
import { GetWebInfo } from "@/api/webInfo/types/getWebInfo"

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

// 获取小站资讯
export const getWebInfo = () =>
  request.get<any, GetWebInfo["data"]>(server + prefix + API.webInfo)

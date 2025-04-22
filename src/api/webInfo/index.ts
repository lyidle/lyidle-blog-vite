import request from "@/utils/request"
// 引入类型
import { GetWebInfo } from "@/api/webInfo/types/getWebInfo"
import { paginationQuery } from "../types/paginationQuery"
import { GetSiteTimes } from "./types/getSiteTimes"
import { PutSiteTimesBody } from "./types/putSiteTimesBody"
import { SiteTime } from "./types/siteTime"

// 统一管理 api
enum API {
  menuList = "/admin/menuList",
  announce = "/admin/announce",
  poetry = "/admin/poetry",
  webInfo = "/webinfo",
  tourist = "/visitor",
  getTime = "/admin/site/time/get",
  delTime = "/admin/site/time/del",
  addTime = "/admin/site/time/add",
  putTime = "/admin/site/time/put",
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

// 获取 网站建设进程
export const getSiteTimes = (data: paginationQuery) =>
  request.get<any, GetSiteTimes["data"]>(
    server + prefix + API.getTime + `/?${new URLSearchParams(data)}`
  )
// 增加 网站建设进程
export const addSiteTimes = (content: string) =>
  request.post<any, SiteTime["data"]>(server + prefix + API.addTime, {
    content,
  })
// 删除 网站建设进程
export const delSiteTimes = (id: number) =>
  request.delete<any, { id: number }>(server + prefix + API.delTime + `/${id}`)
// 修改 网站建设进程
export const putSiteTimes = (data: PutSiteTimesBody) =>
  request.put<any, SiteTime["data"]>(server + prefix + API.putTime, data)

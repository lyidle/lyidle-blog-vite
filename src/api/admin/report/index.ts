import request from "@/utils/request"

// 类型
import { GetReportQuery } from "./types/getReportQuery"
import { GetReports } from "./types/getReports"

// 统一管理 api
enum API {
  get = "/admin/report/get/pagination",
  del = "/admin/report/del",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 得到举报的信息
export const getReports = (data: GetReportQuery) =>
  request.get<any, GetReports["data"]>(
    server + prefix + API.get + `/?${new URLSearchParams(data)}`
  )

// 删除举报的信息
export const delReports = (reportId: number) =>
  request.delete<any, void>(server + prefix + API.del + `/${reportId}`)

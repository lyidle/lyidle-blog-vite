import request from "@/utils/request"
// 引入类型
import { AddReportBody } from "./types/addReportBody"
import { AddReport } from "./types/addReport"
// 统一管理 api
enum API {
  // 用户浏览量
  add = "/user/report/add",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 用户举报
export const addReport = (data: AddReportBody) =>
  request.post<any, AddReport>(server + prefix + API.add, data)

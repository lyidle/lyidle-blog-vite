import request from "@/utils/request"

// 类型
import { SendMsg } from "./types/sendMsg"
import { SentSystemMsg } from "./types/sentSystemMsg"
// 统一管理 api
enum API {
  send = "/admin/sysMsg/send",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 得到举报的信息
export const sendSystemMsg = (data: SentSystemMsg) =>
  request.post<any, SendMsg["data"]>(server + prefix + API.send, data)

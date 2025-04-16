import request from "@/utils/request"

// 类型
import { SendMsg } from "./types/sendMsg"
import { SentSystemMsg } from "./types/sentSystemMsg"
import { GetMsgQuery } from "./types/getMsgQuery"
import { GetMsg } from "./types/getMsg"
// 统一管理 api
enum API {
  send = "/admin/sysMsg/send",
  get = "/admin/sysMsg/get/pagination",
  del = "/admin/sysMsg/del",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 发送系统消息
export const sendSystemMsg = (data: SentSystemMsg) =>
  request.post<any, SendMsg["data"]>(server + prefix + API.send, data)

// 得到系统消息
export const getSystemMsg = (data: GetMsgQuery) =>
  request.get<any, GetMsg["data"]>(
    server + prefix + API.get + `/?${new URLSearchParams(data)}`
  )

// 删除系统消息
export const delSystemMsg = (msgId: number) =>
  request.delete<any, void>(server + prefix + API.del + `/${msgId}`)

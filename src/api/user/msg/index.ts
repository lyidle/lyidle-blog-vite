import request from "@/utils/request"
// 引入类型
import { GetUserReply } from "./types/getUserReply"
import { paginationQuery } from "@/api/types/paginationQuery"
import { GetUserLikes } from "./types/getUserLikes"
import { GetUserLikeDetailsQuery } from "./types/getUserLikeDetailsQuery"
import { GetUserLikeDetails } from "./types/getUserLikeDetails"
import { GetUserAt } from "./types/getUserAt"
import { GetUserMsg } from "./types/getUserMsg"
import { SendUserMsg } from "./types/sendUserMsg"
import { SendUserMsgBody } from "./types/sendUserMsgBody"
import { GetUserMsgDetailsQuery } from "./types/getUserMsgDetailsQuery"
import { GetUserMsgDetails } from "./types/getUserMsgDetails"
// 统一管理 api
enum API {
  // 回复我的
  reply = "/user/msg/reply",
  // 收到的赞
  likes = "/user/msg/likes",
  // 收到的赞详情
  likeDetails = "/user/msg/likes/details",
  // at我的
  at = "/user/msg/at",
  // 发送消息
  send = "/user/msg/whisper/send",
  // 获取消息
  get = "/user/msg/whisper/get",
  // 获取消息 分页形式的 用户之间的
  details = "/user/msg/whisper/get/details",
  // 是否有新消息
  status = "/user/msg/whisper/mark",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 回复我的
export const getUserReply = (data?: paginationQuery) =>
  request.get<any, GetUserReply["data"]>(
    server + prefix + API.reply + `/?${new URLSearchParams(data)}`
  )

// 收到的赞
export const getUserLikes = (data?: paginationQuery) =>
  request.get<any, GetUserLikes["data"]>(
    server + prefix + API.likes + `/?${new URLSearchParams(data)}`
  )

// 收到的赞详情
export const getUserLikeDetails = (data: GetUserLikeDetailsQuery) =>
  request.get<any, GetUserLikeDetails["data"]>(
    server + prefix + API.likeDetails + `/?${new URLSearchParams(data)}`
  )

// at我的
export const getUserAt = (data?: paginationQuery) =>
  request.get<any, GetUserAt["data"]>(
    server + prefix + API.at + `/?${new URLSearchParams(data)}`
  )

// 获取 用户的消息列表
export const getUserMsg = (data?: paginationQuery) =>
  request.get<any, GetUserMsg["data"]>(
    server + prefix + API.get + `/?${new URLSearchParams(data)}`
  )

// 获取 用户的消息列表 和用户之间的消息，按照时间降序排序
export const getUserMsgDetails = (data: GetUserMsgDetailsQuery) =>
  request.get<any, GetUserMsgDetails["data"]>(
    server + prefix + API.details + `/?${new URLSearchParams(data)}`
  )

// 发送 用户消息
export const sendUserMsg = (data: SendUserMsgBody) =>
  request.post<any, SendUserMsg["data"]>(server + prefix + API.send, data)

// 得到消息的状态
export const userMsgStatus = (receiverId: number) =>
  request.get<any, boolean>(
    server + prefix + API.status + `/?receiverId=${receiverId}`
  )

import request from "@/utils/request"
// 引入类型
import { GetUserReply } from "./types/getUserReply"
import { paginationQuery } from "@/api/types/paginationQuery"
import { GetUserLikes } from "./types/getUserLikes"
import { GetUserLikeDetailsQuery } from "./types/getUserLikeDetailsQuery"
import { GetUserLikeDetails } from "./types/getUserLikeDetails"
// 统一管理 api
enum API {
  // 回复我的
  reply = "/user/msg/reply",
  // 收到的赞
  likes = "/user/msg/likes",
  // 收到的赞详情
  likeDetails = "/user/msg/likes/details",
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

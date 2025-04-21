import request from "@/utils/request"
// 引入类型
import { paginationQuery } from "@/api/types/paginationQuery"
import { GetCollects } from "./types/getCollects"
// 统一管理 api
enum API {
  get = "/article/get/collect",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 得到收藏的 文章 id等信息
export const getCollects = (data: paginationQuery) =>
  request.get<any, GetCollects["data"]>(
    server + prefix + API.get + `/?${new URLSearchParams(data)}`
  )

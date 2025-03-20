import request from "@/utils/request"
// 引入类型
import { AddComment } from "./types/addComment"
import { AddCommentBody } from "./types/addCommentBody"
import { GetComments } from "./types/getComments"

// 统一管理 api
enum API {
  comments = "/comments",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 增加评论
export const addComment = (data: AddCommentBody) =>
  request.post<any, AddComment["data"]>(server + prefix + API.comments, data)
// 查询评论
export const getComments = (articleId: number) =>
  request.get<any, GetComments["data"]>(
    server + prefix + API.comments + `/${articleId}`
  )

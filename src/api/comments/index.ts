import request from "@/utils/request"
// 引入类型
import { AddComment } from "./types/addComment"
import { AddCommentBody } from "./types/addCommentBody"
import { GetComments } from "./types/getComments"
import { GetCommentQuery } from "./types/getCommentQuery"
import { GetCommentsReplies } from "./types/getCommentsReplies"

// 统一管理 api
enum API {
  comments = "/comments",
  putComment = "/comments/update",
  delComment = "/comments/delete",
  pagination = "/comments/pagination",
  repliesPagination = "/comments/replies/pagination",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 增加评论
export const addComment = (data: AddCommentBody) =>
  request.post<any, AddComment["data"]>(server + prefix + API.comments, data)
// 查询评论
export const getComments = (data: GetCommentQuery) =>
  request.get<any, GetComments["data"]>(
    server + prefix + API.pagination + `/?${new URLSearchParams(data)}`
  )

// 查询回复
export const getCommentsReplies = (parentId: number, data: GetCommentQuery) =>
  request.get<any, GetCommentsReplies["data"]>(
    server +
      prefix +
      API.repliesPagination +
      `/${parentId}` +
      `/?${new URLSearchParams(data)}`
  )

// 修改 评论
export const putComment = (data: { commentId: number; content: string }) =>
  request.put<any, AddComment["data"]>(server + prefix + API.putComment, data)

// 删除 评论
export const delComment = (commentId: number) =>
  request.delete<any, AddComment["data"]>(
    server + prefix + API.delComment + `/${commentId}`
  )

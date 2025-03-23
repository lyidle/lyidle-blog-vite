import request from "@/utils/request"

// 引入 类型
import type { AddCommentLikeOrDislikeQuery } from "./types/addCommentLikeOrDislikeQuery"
import { LikeOrDislikeCounts } from "./types/likeOrDislikeCounts"

// 统一管理 api
enum API {
  commentLikes = "/likeOrdislike/comments/get/like",
  commentDislikes = "/likeOrdislike/comments/get/dislike",
  toggleCommentLikes = "/likeOrdislike/comments/like",
  toggleCommentDislikes = "/likeOrdislike/comments/dislike",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 得到 点赞数
export const getCommentLikes = (commentId: number) =>
  request.get<any, LikeOrDislikeCounts["data"]>(
    server + prefix + API.commentLikes + `/${commentId}`
  )
// 点赞
export const toggleCommentLikes = (
  commentId: number,
  data: AddCommentLikeOrDislikeQuery
) =>
  request.post<any, void>(
    server +
      prefix +
      API.toggleCommentLikes +
      `/${commentId}` +
      `/?${new URLSearchParams(data)}`
  )

// 得到 点踩数
export const getCommentDislikes = (commentId: number) =>
  request.get<any, LikeOrDislikeCounts["data"]>(
    server + prefix + API.commentDislikes + `/${commentId}`
  )
// 点踩
export const toggleCommentDislikes = (
  commentId: number,
  data: AddCommentLikeOrDislikeQuery
) =>
  request.post<any, void>(
    server +
      prefix +
      API.toggleCommentDislikes +
      `/${commentId}` +
      `/?${new URLSearchParams(data)}`
  )

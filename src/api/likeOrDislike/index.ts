import request from "@/utils/request"

// 引入 类型
import type { AddCommentLikeOrDislikeQuery } from "./types/addCommentLikeOrDislikeQuery"
import { LikeOrDislikeCounts } from "./types/likeOrDislikeCounts"

// 统一管理 api
enum API {
  // #region 文章的评论
  articleCommentLikes = "/likeOrdislike/comments/get/like",
  articleCommentDislikes = "/likeOrdislike/comments/get/dislike",
  articleToggleCommentLikes = "/likeOrdislike/comments/like",
  articleToggleCommentDislikes = "/likeOrdislike/comments/dislike",
  // #endregion 文章的评论
  // #region 设置的评论
  settingCommentLikes = "/likeOrdislike/settings/comments/get/like",
  settingCommentDislikes = "/likeOrdislike/settings/comments/get/dislike",
  settingToggleCommentLikes = "/likeOrdislike/settings/comments/like",
  settingToggleCommentDislikes = "/likeOrdislike/settings/comments/dislike",
  // #endregion 设置的评论
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// #region 文章的评论
// 得到 点赞数
export const getArticleCommentLikes = (commentId: number) =>
  request.get<any, LikeOrDislikeCounts["data"]>(
    server + prefix + API.articleCommentLikes + `/${commentId}`
  )
// 点赞
export const articleToggleCommentLikes = (
  commentId: number,
  data: AddCommentLikeOrDislikeQuery
) =>
  request.post<any, void>(
    server +
      prefix +
      API.articleToggleCommentLikes +
      `/${commentId}` +
      `/?${new URLSearchParams(data)}`
  )

// 得到 点踩数
export const getArticleCommentDislikes = (commentId: number) =>
  request.get<any, LikeOrDislikeCounts["data"]>(
    server + prefix + API.articleCommentDislikes + `/${commentId}`
  )
// 点踩
export const articleToggleCommentDislikes = (
  commentId: number,
  data: AddCommentLikeOrDislikeQuery
) =>
  request.post<any, void>(
    server +
      prefix +
      API.articleToggleCommentDislikes +
      `/${commentId}` +
      `/?${new URLSearchParams(data)}`
  )
// #endregion 文章的评论

// #region 设置的评论
// 得到 点赞数
export const getSettingCommentLikes = (commentId: number) =>
  request.get<any, LikeOrDislikeCounts["data"]>(
    server + prefix + API.settingCommentLikes + `/${commentId}`
  )
// 点赞
export const settingToggleCommentLikes = (
  commentId: number,
  data: AddCommentLikeOrDislikeQuery
) =>
  request.post<any, void>(
    server +
      prefix +
      API.settingToggleCommentLikes +
      `/${commentId}` +
      `/?${new URLSearchParams(data)}`
  )

// 得到 点踩数
export const getSettingCommentDislikes = (commentId: number) =>
  request.get<any, LikeOrDislikeCounts["data"]>(
    server + prefix + API.settingCommentDislikes + `/${commentId}`
  )
// 点踩
export const settingToggleCommentDislikes = (
  commentId: number,
  data: AddCommentLikeOrDislikeQuery
) =>
  request.post<any, void>(
    server +
      prefix +
      API.settingToggleCommentDislikes +
      `/${commentId}` +
      `/?${new URLSearchParams(data)}`
  )
// #endregion 设置的评论

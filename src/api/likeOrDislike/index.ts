import request from "@/utils/request"

// 引入 类型
import type { AddCommentLikeOrDislikeQuery } from "./types/addCommentLikeOrDislikeQuery"
import { LikeOrDislikeCounts } from "./types/likeOrDislikeCounts"

// 统一管理 api
enum API {
  // #region 文章的评论
  commentLike = "/likeOrdislike/comments/get/like",
  commentDislike = "/likeOrdislike/comments/get/dislike",
  commentToggleCommentLikes = "/likeOrdislike/comments/like",
  commentToggleCommentDislikes = "/likeOrdislike/comments/dislike",
  // #endregion 文章的评论

  // #region 文章的点赞
  articleLikes = "/likeOrdislike/articles/get/like",
  articleDislikes = "/likeOrdislike/articles/get/dislike",
  articleToggleLikes = "/likeOrdislike/articles/like",
  articleToggleDislikes = "/likeOrdislike/articles/dislike",
  // #endregion 文章的点赞

  // #region 设置文章的点赞
  settingLikes = "/likeOrdislike/settings/get/like",
  settingDislikes = "/likeOrdislike/settings/get/dislike",
  settingToggleLikes = "/likeOrdislike/settings/like",
  settingToggleDislikes = "/likeOrdislike/settings/dislike",
  // #endregion 设置文章的点赞
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// #region 文章的评论点赞
// 得到 点赞数
export const getArticleCommentLikes = (commentId: number) =>
  request.get<any, LikeOrDislikeCounts["data"]>(
    server + prefix + API.commentLike + `/${commentId}`
  )
// 点赞
export const articleToggleCommentLikes = (
  commentId: number,
  data: AddCommentLikeOrDislikeQuery
) =>
  request.post<any, void>(
    server +
      prefix +
      API.commentToggleCommentLikes +
      `/${commentId}` +
      `/?${new URLSearchParams(data)}`
  )

// 得到 点踩数
export const getArticleCommentDislikes = (commentId: number) =>
  request.get<any, LikeOrDislikeCounts["data"]>(
    server + prefix + API.commentDislike + `/${commentId}`
  )
// 点踩
export const articleToggleCommentDislikes = (
  commentId: number,
  data: AddCommentLikeOrDislikeQuery
) =>
  request.post<any, void>(
    server +
      prefix +
      API.commentToggleCommentDislikes +
      `/${commentId}` +
      `/?${new URLSearchParams(data)}`
  )
// #endregion 文章的评论点赞

// #region 文章的点赞
// 得到 点赞数
export const getArticleLikes = (articleId: number) =>
  request.get<any, LikeOrDislikeCounts["data"]>(
    server + prefix + API.articleLikes + `/${articleId}`
  )
// 点赞
export const articleToggleLike = (
  commentId: number,
  data: AddCommentLikeOrDislikeQuery
) =>
  request.post<any, void>(
    server +
      prefix +
      API.articleToggleLikes +
      `/${commentId}` +
      `/?${new URLSearchParams(data)}`
  )
// #endregion 文章的点赞

// #region 设置文章的点赞
// 得到 点赞数
export const getSettingLikes = (settingId: number) =>
  request.get<any, LikeOrDislikeCounts["data"]>(
    server + prefix + API.settingLikes + `/${settingId}`
  )
// 点赞
export const settingToggleLike = (
  commentId: number,
  data: AddCommentLikeOrDislikeQuery
) =>
  request.post<any, void>(
    server +
      prefix +
      API.settingToggleLikes +
      `/${commentId}` +
      `/?${new URLSearchParams(data)}`
  )
// #endregion 设置文章的点赞

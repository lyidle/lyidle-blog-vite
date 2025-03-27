import request from "@/utils/request"
// 引入类型
// 统一管理 api
enum API {
  // 用户浏览量
  articleViews = "/article/views",
  // 用户获赞量
  articleLikes = "/article/likes",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 得到用户的文章浏览量
export const getUserArticleViews = (userId: number) =>
  request.get<any, any>(server + prefix + API.articleViews + `/${userId}`)
// 得到用户的获赞量
export const getUserArticleLikes = (userId: number) =>
  request.get<any, any>(server + prefix + API.articleLikes + `/${userId}`)

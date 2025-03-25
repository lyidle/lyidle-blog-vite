import request from "@/utils/request"
import { GetCollects } from "./types/getCollects"

// 引入 类型

// 统一管理 api
enum API {
  getArticleCollects = "/mark/article/get",
  toggleArticleCollects = "/mark/article/toggle",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 获取 文章的收藏
export const getArticleCollects = (articleId: number) =>
  request.get<any, GetCollects["data"]>(
    server + prefix + API.getArticleCollects + `/${articleId}`
  )

// 切换 文章的收藏
export const toggleArticleCollects = (
  articleId: number,
  data?: {
    isBookmarked?: boolean
  }
) =>
  request.post<any, GetCollects["data"]>(
    server + prefix + API.toggleArticleCollects + `/${articleId}`,
    data
  )

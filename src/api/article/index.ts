import request from "@/utils/request"
// 引入类型
import { GetArticle } from "@/api/article/types/getArticle"
import { GetCarousel } from "@/api/article/types/getCarousel"
import { GetRecentPages } from "@/api/article/types/getRecentPages"
import { GetRecentPagesQuery } from "@/api/article/types/getRecentPagesQuery"
// 统一管理 api
enum API {
  getCarousel = "/article/carousel",
  getArticle = "/article/get",
  getRecentPages = "/article/recentPages",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 获取焦点轮播图
export const getCarousel = (limit?: number) =>
  request.get<any, GetCarousel["data"]>(
    `${server + prefix + API.getCarousel}${limit ? `/?limit=${limit}` : ""}`
  )

// 获取文章
export const getArticle = (currentPage?: number, pageSize?: number) =>
  request.get<any, GetArticle["data"]>(
    `${server + prefix + API.getArticle}${
      currentPage && pageSize
        ? `/?currentPage=${currentPage}&pageSize=${pageSize}`
        : ""
    }`
  )

// 获取最新文章
export const getRecentPages = (limit?: number) =>
  request.get<any, GetRecentPages["data"]>(
    `${server + prefix + API.getRecentPages}${limit ? `/?limit=${limit}` : ""}`
  )

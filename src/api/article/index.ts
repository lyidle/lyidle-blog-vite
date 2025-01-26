import request from "@/utils/request"
// 引入类型
import type { GetArticle } from "@/api/article/types/getArticle"
import type { GetArticleQuery } from "@/api/article/types/getArticleQuery"
import type { GetCarousel } from "@/api/article/types/getCarousel"
import type { GetCarouselQuery } from "@/api/article/types/getCarouselQuery"
import type { GetRecentPages } from "@/api/article/types/getRecentPages"
import type { GetRecentPagesQuery } from "@/api/article/types/getRecentPagesQuery"
import type { SearchArticle } from "@/api/article/types/searchArticle"
import type { SearchArticleQuery } from "@/api/article/types/searchArticleQuery"
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
import { AddArticleBody } from "@/api/article/types/addArticleBody"
import { AddArticle } from "@/api/article/types/addArticle"

// 统一管理 api
enum API {
  getCarousel = "/article/carousel",
  getArticle = "/article/get",
  getRecentPages = "/article/recentPages",
  searchArticleExact = "/article/search/exact",
  getOneArticle = "/article/getOne",
  addArticle = "/article/admin/add",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 获取焦点轮播图
export const getCarousel = (data?: GetCarouselQuery) =>
  request.get<any, GetCarousel["data"]>(
    `${server + prefix + API.getCarousel}${
      data?.limit ? `/?limit=${data?.limit}` : ""
    }`
  )

// 获取文章
export const getArticle = (data: GetArticleQuery) =>
  request.get<any, GetArticle["data"]>(
    `${server + prefix + API.getArticle}${
      data.currentPage && data.pageSize
        ? `/?currentPage=${data.currentPage}&pageSize=${data.pageSize}`
        : ""
    }`
  )

// 获取最新文章
export const getRecentPages = (data?: GetRecentPagesQuery) =>
  request.get<any, GetRecentPages["data"]>(
    `${server + prefix + API.getRecentPages}${
      data?.limit ? `/?limit=${data?.limit}` : ""
    }`
  )

// 精确搜索文章
export const searchArticleExact = (data: SearchArticleQuery) =>
  request.get<any, SearchArticle["data"]>(
    `${server + prefix + API.searchArticleExact}` +
      `${data.id ? `/?id=${data.id}` : ""}` +
      `${data.author ? `/?author=${data.author}` : ""}` +
      `${data.category ? `/?category=${data.category}` : ""}` +
      `${data.desc ? `/?desc=${data.desc}` : ""}` +
      `${data.tags ? `/?tags=${data.tags}` : ""}` +
      `${data.title ? `/?title=${data.title}` : ""}`
  )

// 按照id 获取文章
export const getOneArticle = (id: string | number) =>
  request.get<any, GetOneArticle["data"]>(
    `${server + prefix + API.getOneArticle}/?id=${id}`
  )

// 增加文章
export const addArticle = (data: AddArticleBody) =>
  request.post<any, AddArticle["data"]>(server + prefix + API.addArticle, data)

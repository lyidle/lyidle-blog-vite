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
import { UpdateArticleBody } from "./types/updateArticleBody"
// 统一管理 api
enum API {
  getCarousel = "/article/carousel",
  getArticle = "/article/get",
  getRecentPages = "/article/recentPages",
  searchArticleExact = "/article/search/exact",
  getOneArticle = "/article/getOne",
  addArticle = "/article/admin/add",
  updateArticle = "/article/admin/update",
  binArticle = "/article/admin/bin",
  clearArticle = "/article/admin/clear",
  getTagsAll = "/article/getTags/all",
  getCategoriesAll = "/article/getCategories/all",
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

// 更新文章
export const updateArticle = (data: UpdateArticleBody) =>
  request.put<any, void>(server + prefix + API.updateArticle, data)

// 软删除文章 有后悔期间
export const removeArticle = (id: number | string) =>
  request.delete<any, number>(server + prefix + API.binArticle, {
    data: { id },
  })

// 彻底删除文章 无后悔期间
export const deleteArticle = (id: number | string) =>
  request.delete<any, number>(server + prefix + API.clearArticle, {
    data: { id },
  })

// 获取所有 tags
export const getTagsAll = (author: string) =>
  request.get<any, { [key in string]: number }>(
    server + prefix + API.getTagsAll + `/?author=${author}`
  )

// 获取所有 categories
export const getCategoriesAll = (author: string) =>
  request.get<any, { [key in string]: number }>(
    server + prefix + API.getCategoriesAll + `/?author=${author}`
  )

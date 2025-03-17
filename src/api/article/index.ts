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
import { GetArticleByAuthorAndIdQuery } from "./types/getArticleByAuthorAndIdQuery"
// 统一管理 api
enum API {
  getCarousel = "/article/carousel",
  getArticle = "/article/get/pagination",
  getRecentPages = "/article/recentPages",
  searchArticle = "/article/search",
  searchArticleExact = "/article/search/exact",
  searchArticleMerge = "/article/search/merge",
  searchArticleMergeExact = "/article/search/merge/exact",
  // 通过id搜索
  getOneArticle = "/article/get/id",
  // 通过 id和作者搜索
  getArticleByAuthorAndId = "/article/get/authorAndId",
  // 增加 获取的 req.auth.id 为 userId
  addArticle = "/article/admin/add",
  // 修改 获取的 req.auth.id 为 userId
  updateArticle = "/article/admin/update",
  // 删除 获取的 req.auth.id 为 userId
  binArticle = "/article/admin/bin",
  recoverArticle = "/article/admin/restore",
  clearArticle = "/article/admin/clear",
  // 后退后台管理的api
  managerBinArticle = "/article/admin/bin/manager",
  managerClearArticle = "/article/admin/clear/manager",
  managerSetCarousel = "/article/admin/setCarousel",
  // 获取 所有tags
  // 获取 所有tags
  getTagsAll = "/article/getTags/all",
  // 获取 所有categories
  getCategoriesAll = "/article/getCategories/all",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 获取焦点轮播图
export const getCarousel = (data?: GetCarouselQuery) =>
  request.get<any, GetCarousel["data"]>(
    `${server + prefix + API.getCarousel}` + `/?${new URLSearchParams(data)}`
  )

// 获取文章
export const getArticle = (data: GetArticleQuery) =>
  request.get<any, GetArticle["data"]>(
    `${server + prefix + API.getArticle}` + `/?${new URLSearchParams(data)}`
  )

// 获取最新文章
export const getRecentPages = (data?: GetRecentPagesQuery) =>
  request.get<any, GetRecentPages["data"]>(
    `${server + prefix + API.getRecentPages}` + `/?${new URLSearchParams(data)}`
  )

// 搜索文章的回调
const searchArticleCallback =
  (api: APIKeysType) => (data: SearchArticleQuery) =>
    request.get<any, SearchArticle["data"]>(
      `${server + prefix + API[api]}` + `/?${new URLSearchParams(data)}`
    )

// 模糊搜索文章
export const searchArticle = searchArticleCallback("searchArticle")

// 精确搜索文章
export const searchArticleExact = searchArticleCallback("searchArticleExact")

// 模糊搜索文章和并查询
export const searchArticleMerge = searchArticleCallback("searchArticleMerge")

// 精确搜索文章和并查询
export const searchArticleMergeExact = searchArticleCallback(
  "searchArticleMergeExact"
)

// 按照id 获取文章
export const getOneArticle = (id: string | number) =>
  request.get<any, GetOneArticle["data"]>(
    `${server + prefix + API.getOneArticle}/?id=${id}`
  )

// 按照 作者 和 文章id 获取文章
export const getArticleByAuthorAndId = (data: GetArticleByAuthorAndIdQuery) =>
  request.get<any, GetOneArticle["data"]>(
    `${server + prefix + API.getArticleByAuthorAndId}` +
      `/?${new URLSearchParams(data)}`
  )

// 增加文章
export const addArticle = (data: AddArticleBody) =>
  request.post<any, AddArticle["data"]>(server + prefix + API.addArticle, data)

// 更新文章
export const updateArticle = (data: UpdateArticleBody) =>
  request.put<any, void>(server + prefix + API.updateArticle, data)

// 软删除文章 有后悔期间 是本用户的id
export const removeArticle = (id: number | string) =>
  request.delete<any, number>(server + prefix + API.binArticle, {
    data: { id },
  })
// 恢复 文章 需要 是本用户的id
export const recoverArticle = () =>
  request.put<any, void>(server + prefix + API.recoverArticle)

// 彻底删除文章 无后悔期间 是本用户的id
export const deleteArticle = (id: number | string) =>
  request.delete<any, number>(server + prefix + API.clearArticle, {
    data: { id },
  })
// 软删除文章 有后悔期间 后台管理的 api 需要有权限
export const managerRemoveArticle = (id: number | string) =>
  request.delete<any, number>(server + prefix + API.managerBinArticle, {
    data: { id },
  })

// 彻底删除文章 无后悔期间 后台管理的 api 需要有权限
export const managerDeleteArticle = (id: number | string) =>
  request.delete<any, number>(server + prefix + API.managerClearArticle, {
    data: { id },
  })
// 更新文章轮播图和置顶状态
export const managerUpdateArticle = (data: { id: number; carousel: boolean }) =>
  request.put<any, void>(server + prefix + API.managerSetCarousel, data)

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

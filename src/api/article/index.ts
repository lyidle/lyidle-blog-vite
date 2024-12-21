import request from "@/utils/request"

// 统一管理 api
enum API {
  getCarousel = "/article/carousel",
  getArticle = "/article/get",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 获取焦点轮播图
export const reqCarousel = (limit?: number) =>
  request.get<any, any>(
    `${server + prefix + API.getCarousel}${limit ? `/?limit=${limit}` : ""}`
  )

// 获取文章
export const reqArticle = (currentPage?: number, pageSize?: number) =>
  request.get<any, any>(
    `${server + prefix + API.getArticle}${
      currentPage && pageSize
        ? `/?currentPage=${currentPage}&pageSize=${pageSize}`
        : ""
    }`
  )

import request from "@/utils/request"

// 统一管理 api
enum API {
  // 文章
  getArticleShare = "/share/article/get",
  addArticleShare = "/share/article/add",
  // 设置
  getSettingShare = "/share/setting/get",
  addSettingShare = "/share/setting/add",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// #region 文章
// 获取 收藏
export const getArticleShares = (articleId: number) =>
  request.get<any, number>(
    server + prefix + API.getArticleShare + `/${articleId}`
  )

// 增加 收藏
export const addArticleShare = (articleId: number) =>
  request.post<any, void>(
    server + prefix + API.addArticleShare + `/${articleId}`
  )
// #endregion 文章

// #region 设置
// 获取 收藏
export const getSettingShares = (seetingId: number) =>
  request.get<any, number>(
    server + prefix + API.getSettingShare + `/${seetingId}`
  )

// 增加 收藏
export const addSettingShare = (seetingId: number) =>
  request.post<any, void>(
    server + prefix + API.addSettingShare + `/${seetingId}`
  )
// #endregion 设置

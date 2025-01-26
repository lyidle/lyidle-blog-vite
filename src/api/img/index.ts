import request from "@/utils/request"
// 引入类型
/* 
  set的最后是携带的参数类型
*/
import { PostTempImg } from "./types/postTempImg"
// 统一管理 api
export enum API {
  urlImgTemp = "/upload/img/temp",
  fileImgTemp = "/upload/files/img/temp",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// vditor 的 图片 上传需要
export const tempImgUrl = server + prefix + API.urlImgTemp
// vditor 的 图片 文件上传需要
export const tempImgFiles = server + prefix + API.fileImgTemp

// 上传  图片 的接口 单个
export const postTempImgUrl = (url: string) =>
  request.post<any, PostTempImg["data"]>(tempImgUrl, { url })

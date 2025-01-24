import request from "@/utils/request"
// 引入类型
/* 
  set的最后是携带的参数类型
*/
import { PostTempImg } from "./types/postTempImg"
// 统一管理 api
export enum API {
  temp = "/upload/img/temp",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// vditor 的 图片 上传需要
export const postTempImgUrl = server + prefix + API.temp

// 获取菜单
export const postTempImg = (url: string) =>
  request.post<any, PostTempImg["data"]>(postTempImgUrl, { url })

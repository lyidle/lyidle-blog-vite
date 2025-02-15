import request from "@/utils/request"
// 引入类型
/* 
  set的最后是携带的参数类型
*/
import { PostTempImg } from "./types/postTempImg"
import { PostTempImgFiles } from "./types/postTempImgFiles"
import { PostImgPermanentBody } from "./types/postImgPermanentBody"
import { PostImgPermanent } from "./types/postImgPermanent"

// 统一管理 api
export enum API {
  urlImgTemp = "/upload/img/temp",
  fileImgTemp = "/upload/files/img/temp",
  tempTOPermanent = "/upload/img/tempImgToPermanet",
  remove = "/upload/remove",
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

// 上传  图片 的接口 文件
export const postTempImgFiles = (files: File[]) => {
  const formData = new FormData()
  // `file[]` 是参数名，多个文件
  files.forEach((file) => {
    formData.append("file[]", file)
  })

  return request.post<FormData, PostTempImgFiles["data"]>(
    tempImgFiles,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
}

// 上传  图片 临时转 永久  的接口 需要传入 临时图片路径、作者 和 路径
export const postImgPermanent = (data: PostImgPermanentBody) =>
  request.post<any, PostImgPermanent["data"]>(
    server + prefix + API.tempTOPermanent,
    data
  )

// 删除文件
export const removeFileStatic = (urls: string[]) =>
  request.delete<any, any>(server + prefix + API.remove, { data: { urls } })

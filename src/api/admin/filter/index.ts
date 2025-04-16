import request from "@/utils/request"

// 类型
import { AllFilterTypes } from "./types/allFilterTypes"
import { GetFilterWordQuery } from "./types/getFilterWordQuery"
import { GetFilterWords } from "./types/getFilterWords"
import { AddFilterWordBody } from "./types/addFilterWordBody"
import { AddFilterWord } from "./types/AddFilterWord"

// 统一管理 api
enum API {
  type = "/admin/report/get/allTypes",
  get = "/admin/filter/get/pagination",
  del = "/admin/filter/del/",
  add = "/admin/filter/add",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 得到敏感词的分类信息
export const getAllFilterTypes = () =>
  request.get<any, AllFilterTypes["data"]>(server + prefix + API.type)

// 获取到敏感词
export const getFilterWords = (data: GetFilterWordQuery) =>
  request.get<any, GetFilterWords["data"]>(
    server + prefix + API.get + `/?${new URLSearchParams(data)}`
  )

// 删除敏感词
export const delFilterWord = (filterId: number) =>
  request.delete<any, void>(server + prefix + API.del + `/${filterId}`)

// 添加敏感词
export const addFilterWord = (data: AddFilterWordBody) =>
  request.post<any, AddFilterWord["data"]>(server + prefix + API.add, data)

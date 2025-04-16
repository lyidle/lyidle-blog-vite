import request from "@/utils/request"

// 类型
import { GetFilterWordGroups } from "./getFilterWordGroups"
import { paginationQuery } from "@/api/types/paginationQuery"
import { AddFilterTypeQuery } from "./addFilterTypeQuery"
import { AddFilterType } from "./addFilterType"

// 统一管理 api
enum API {
  get = "/admin/filter/group/get/pagination",
  del = "/admin/filter/group/del",
  add = "/admin/filter/group/add",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 得到敏感词的分类信息
export const getFilterWordGroups = (data: paginationQuery) =>
  request.get<any, GetFilterWordGroups["data"]>(
    server + prefix + API.get + `/?${new URLSearchParams(data)}`
  )

// 创建敏感词的分类
export const addFilterWordGroup = (data: AddFilterTypeQuery) =>
  request.post<any, AddFilterType["data"]>(server + prefix + API.add, data)

// 删除敏感词的分类
export const delFilterWordGroup = (filterTypeId: number) =>
  request.delete<any, void>(server + prefix + API.del + `/${filterTypeId}`)

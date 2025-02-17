import request from "@/utils/request"
// 引入类型
import type { RegEmail } from "./types/regEmail"
import type { RegEmailBody } from "./types/regEmailBody"
import type { Login } from "./types/login"
import type { LoginQuery } from "./types/loginQuery"
import type { Reg } from "./types/reg"
import type { RegBody } from "./types/regBody"
import type { GetUserInfo } from "./types/getUserInfo"
import { SearchUserQuery } from "./types/searchUserQuery"
import { SearchCountsById } from "./types/searchCountsById"
import { SearchByIdOrAccountOrRoleQuery } from "./types/SearchByIdOrAccountOrRoleQuery"
import { Logout } from "./types/logout"
import { SearchUserPagination } from "./types/searchUserPagination"
// 统一管理 api
enum API {
  regEmail = "/user/reg/email",
  reg = "/user/reg",
  login = "/user/login",
  logout = "/user/logout",
  userInfo = "/user/userinfo",
  search = "/user/search",
  exactSearch = "/user/search/exact",
  searchCounts = "/user/search/user",
  removeUser = "/user/admin/bin",
  deleteUser = "/user/admin/clear",
  managerRemoveUser = "/user/admin/bin/manager",
  managerDeleteUser = "/user/admin/clear/manager",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 注册发送邮箱验证码
export const reqRegEmail = (data?: RegEmailBody) =>
  request.post<any, RegEmail>(server + prefix + API.regEmail, data)

// 注册
export const reqReg = (data: RegBody) =>
  request.post<any, Reg>(server + prefix + API.reg, data)

// 登录
export const reqLogin = (data: LoginQuery) =>
  request.get<any, Login["data"]>(
    server + prefix + API.login + `?${new URLSearchParams(data)}`
  )

// 退出登录
export const reqLogout = () =>
  request.get<any, Logout>(server + prefix + API.logout)

// 获取用户信息
export const getUserInfo = () =>
  request.get<any, GetUserInfo["data"]>(server + prefix + API.userInfo)

// 搜索文章的回调
const searchUserCallback = (api: APIKeysType) => (data?: SearchUserQuery) =>
  request.get<any, SearchUserPagination["data"]>(
    server + prefix + API[api] + `?${new URLSearchParams(data)}`
  )

// 模糊搜索用户信息
export const searchUser = searchUserCallback("search")
// 精确搜索用户信息
export const searchExactUser = searchUserCallback("exactSearch")

// 搜索用户通过id、account、roles 且统计个数
export const searchCounts = (data: SearchByIdOrAccountOrRoleQuery) =>
  request.get<any, SearchCountsById["data"]>(
    server + prefix + API.searchCounts + `?${new URLSearchParams(data)}`
  )

const removeCallbackUser = (api: APIKeysType) => (id: number) =>
  request.delete<any, void>(server + prefix + API[api], {
    data: { id },
  })

// 软删除 用户 需要 是本用户拥有权限
export const removeUser = removeCallbackUser("removeUser")

// 彻底删除 用户 需要 是本用户的
export const deleteUser = removeCallbackUser("deleteUser")

// 不需要验证 登录用户拥有权限
// 软删除
export const managerRemoveUser = removeCallbackUser("managerRemoveUser")
// 彻底删除
export const managerDeleteUser = removeCallbackUser("managerDeleteUser")

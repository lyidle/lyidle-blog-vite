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
const searchUserCallback = (api: APIKeysType) => {
  return (data?: SearchUserQuery) =>
    request.get<any, SearchUserPagination["data"]>(
      server + prefix + API[api] + `?${new URLSearchParams(data)}`
    )
}

// 模糊搜索用户信息
export const searchUser = searchUserCallback("search")
// 精确搜索用户信息
export const searchExactUser = searchUserCallback("exactSearch")

// 搜索用户通过id、account、roles 且统计个数
export const searchCounts = (data: SearchByIdOrAccountOrRoleQuery) =>
  request.get<any, SearchCountsById["data"]>(
    server + prefix + API.searchCounts + `?${new URLSearchParams(data)}`
  )

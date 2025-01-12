import request from "@/utils/request"
// 引入类型
import type { RegEmail } from "./types/regEmail"
import type { RegEmailBody } from "./types/regEmailBody"
import type { Login } from "./types/login"
import type { LoginQuery } from "./types/loginQuery"
import type { Reg } from "./types/reg"
import type { RegBody } from "./types/regBody"
import type { GetUserInfo } from "./types/getUserInfo"
import { SearchUser } from "./types/searchUser"
import { SearchUserQuery } from "./types/searchUserQuery"
// 统一管理 api
enum API {
  regEmail = "/user/reg/email",
  reg = "/user/reg",
  login = "/user/login",
  userInfo = "/user/userinfo",
  search = "/user/search",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 注册发送邮箱验证码
export const reqRegEmail = (data?: RegEmailBody) =>
  request.post<any, RegEmail["data"]>(
    server + prefix + API.regEmail,
    data?.email
  )

// 注册
export const reqReg = (data: RegBody) =>
  request.post<any, Reg>(server + prefix + API.reg, data)

// 登录
export const reqLogin = (data: LoginQuery) =>
  request.get<any, Login["data"]>(
    server + prefix + API.login + `?${new URLSearchParams(data)}`
  )

// 获取用户信息
export const getUserInfo = () =>
  request.get<any, GetUserInfo["data"]>(server + prefix + API.userInfo)

// 搜索用户信息
export const searchUser = (data: SearchUserQuery) =>
  request.get<any, SearchUser["data"]>(
    server + prefix + API.search + `?${new URLSearchParams(data)}`
  )

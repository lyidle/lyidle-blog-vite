import request from "@/utils/request"

// 统一管理 api
enum API {
  regEmail = "/user/reg/email",
  reg = "/user/reg",
  login = "/user/login",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 注册发送邮箱验证码
export const reqRegEmail = (data: any) =>
  request.post<any, any>(server + prefix + API.regEmail, data)
// 注册
export const reqReg = (data: any) =>
  request.post<any, any>(server + prefix + API.reg, data)
// 登录
export const reqLogin = (data: any) =>
  request.get<any, any>(
    server + prefix + API.login + `?${new URLSearchParams(data)}`
  )

import request from "@/utils/request"
import { reqMenuListType } from "@/api/user/type"
import { prefix } from "@/api/config"
enum API {
  menuList = "/menuList",
  regEmail = "/reg/email",
  reg = "/reg",
  login = "/login",
}
export const reqMenuList = () =>
  request.get<any, reqMenuListType>(prefix.api + API.menuList)
// 注册发送邮箱验证码
export const reqRegEmail = (data: any) =>
  request.post<any, reqMenuListType>(prefix.api + API.regEmail, data)
// 注册
export const reqReg = (data: any) =>
  request.post<any, reqMenuListType>(prefix.api + API.reg, data)
// 登录
export const reqLogin = (data: any) =>
  request.get<any, reqMenuListType>(
    prefix.api + API.login + `?${new URLSearchParams(data)}`
  )

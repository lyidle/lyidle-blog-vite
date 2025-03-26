import request from "@/utils/request"
// 引入类型
import type { Email } from "./types/email"
import type { EmailBody } from "./types/emailBody"
import type { Login } from "./types/login"
import type { LoginQuery } from "./types/loginQuery"
import type { RegBody } from "./types/regBody"
import type { GetUserInfo } from "./types/getUserInfo"
import { SearchUserQuery } from "./types/searchUserQuery"
import { SearchCountsById } from "./types/searchCountsById"
import { SearchByIdOrAccountOrRoleQuery } from "./types/SearchByIdOrAccountOrRoleQuery"
import { Logout } from "./types/logout"
import { SearchUserPagination } from "./types/searchUserPagination"
import { UpdateUserBody } from "./types/updateUserBody"
import { ManagerUpdateUserBody } from "./types/managerUpdateUserBody"
import { UpdateUser } from "./types/updateUser"
import { CreateUserBody } from "./types/createUserBody"
import { managerSetUserRolesBody } from "./types/setUserRolesBody"
import { UserFindByPk } from "./types/userFindByPk"
// 统一管理 api
enum API {
  // 注册相关
  // 邮箱 发送
  regEmail = "/user/reg/email",
  reg = "/user/reg",
  // 登录
  login = "/user/login",
  // 退出登录 清除token redis 缓存
  logout = "/user/logout",
  // 用户信息
  userInfo = "/user/userinfo",
  findByPk = "/user/search/findByPk",
  search = "/user/search",
  exactSearch = "/user/search/exact",
  searchCounts = "/user/search/user",
  // 普通的 需要req.auth.id 的jwt验证
  removeUser = "/user/admin/bin",
  recoverUser = "/user/admin/restore",
  deleteUser = "/user/admin/clear",
  updateUser = "/user/admin/update",
  updateAvatar = "/user/admin/update/avatar",
  updateSigner = "/user/admin/update/signer",
  // 邮箱 发送
  updateUserEmail = "/user/admin/update/email",
  // 管理 面板api
  // 创建
  managerCreateUser = "/user/admin/create",
  // 更新
  managerUpdateUser = "/user/admin/update/manager",
  // 设置角色
  managerSetUserRoles = "/user/admin/setRoles",
  // 删除
  managerRemoveUser = "/user/admin/bin/manager",
  managerDeleteUser = "/user/admin/clear/manager",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 发送 邮箱的接口
const sendEmail = (api: APIKeysType) => (data?: EmailBody) =>
  request.post<any, Email>(server + prefix + API[api], data)

// 注册用户 发送邮箱验证码
export const reqRegEmail = sendEmail("regEmail")

// 更新用户 发送邮箱验证码
export const updateUserEmail = sendEmail("updateUserEmail")

// 注册
export const reqReg = (data: RegBody) =>
  request.post<any, void>(server + prefix + API.reg, data)

// 登录
export const reqLogin = (data: LoginQuery) =>
  request.get<any, Login["data"]>(
    server + prefix + API.login + `/?${new URLSearchParams(data)}`
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
    server + prefix + API[api] + `/?${new URLSearchParams(data)}`
  )

// 模糊搜索用户信息
export const searchUser = searchUserCallback("search")
// 精确搜索用户信息
export const searchExactUser = searchUserCallback("exactSearch")

// 搜索用户通过id、account、roles 且统计个数
export const searchCounts = (data: SearchByIdOrAccountOrRoleQuery) =>
  request.get<any, SearchCountsById["data"]>(
    server + prefix + API.searchCounts + `/?${new URLSearchParams(data)}`
  )

// 通过 id 搜索 用户 只有 用户表的 信息
export const userFindByPk = (userId: number) =>
  request.get<any, UserFindByPk["data"]>(
    server + prefix + API.findByPk + `/${userId}`
  )

// 删除的回调
const removeCallbackUser = (api: APIKeysType) => (id: number) =>
  request.delete<any, void>(server + prefix + API[api], {
    data: { id },
  })

// 软删除 用户 需要 是本用户的id
export const removeUser = () =>
  request.delete<any, string>(server + prefix + API.removeUser)
// 恢复 用户 需要 是本用户的id
export const recoverUser = () =>
  request.put<any, void>(server + prefix + API.recoverUser)

// 彻底删除 用户 需要 是本用户的id
export const deleteUser = () =>
  request.delete<any, void>(server + prefix + API.deleteUser)

// 不需要验证是本用户的id
// 登录用户需要拥有权限
// 软删除
export const managerRemoveUser = removeCallbackUser("managerRemoveUser")
// 彻底删除
export const managerDeleteUser = removeCallbackUser("managerDeleteUser")

// 修改用户 需要 是本用户的id
export const updateUser = (data: UpdateUserBody) =>
  request.put<any, UpdateUser["data"]>(server + prefix + API.updateUser, data)
// 修改用户头像 需要 是本用户的id
export const updateUserAvatar = (avatar: string) =>
  request.put<any, UpdateUser["data"]>(server + prefix + API.updateAvatar, {
    avatar,
  })

// 修改用户签名 需要 是本用户的id
export const updateUserSigner = (signer: string) =>
  request.put<any, { signer: string; token: string }>(
    server + prefix + API.updateSigner,
    {
      signer,
    }
  )

// 不需要验证是本用户的id 需要传入 id
// 登录用户需要拥有权限
export const managerUpdateUser = (data: ManagerUpdateUserBody) =>
  request.put<any, UpdateUser["data"]>(
    server + prefix + API.managerUpdateUser,
    data
  )

// 创建用户  登录用户需要拥有权限
export const managerCreateUser = (data: CreateUserBody) =>
  request.post<any, void>(server + prefix + API.managerCreateUser, data)

// 分配用户的权限
export const managerSetUserRoles = (data: managerSetUserRolesBody) =>
  request.post<any, void>(server + prefix + API.managerSetUserRoles, data)

import request from "@/utils/request"
/**
 * 回收站的 api
 */

// 引入类型
import type { GetRecycleUser } from "./types/getRecycleUser"
import type { GetRecycleRole } from "./types/GetRecycleRole"
import type { GetRecycleGroup } from "./types/getRecycleGroup"
import type { GetRecyclePermission } from "./types/getRecyclePermission"
import type { GetRecycleMenu } from "./types/getRecycleMenu"
import { SearchUserQuery } from "./types/searchUserQuery"
// 统一管理 api
enum API {
  users = "/admin/recycle/user",
  roles = "/admin/recycle/role",
  groups = "/admin/recycle/group",
  permissions = "/admin/recycle/permission",
  menus = "/admin/recycle/menu",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 获取 回收站的 用户 列表
export const recycleAllUsers = (data: SearchUserQuery) =>
  request.get<any, GetRecycleUser["data"]>(
    server + prefix + API.users + `/?${new URLSearchParams(data)}`
  )

// 获取 回收站的 角色 列表
export const recycleAllRoles = (data: any) =>
  request.get<any, GetRecycleRole["data"]>(server + prefix + API.roles)

// 获取 回收站的 权限组 列表
export const recycleAllGroups = (data: any) =>
  request.get<any, GetRecycleGroup["data"]>(server + prefix + API.groups)

// 获取 回收站的 权限 列表
export const recycleAllPermissions = (data: any) =>
  request.get<any, GetRecyclePermission["data"]>(
    server + prefix + API.permissions
  )

// 获取 回收站的 菜单 列表
export const recycleAllMenus = (data: any) =>
  request.get<any, GetRecycleMenu["data"]>(server + prefix + API.menus)

import request from "@/utils/request"
/**
 * 回收站的 api
 */

// 引入类型
import type { GetRecycleUser } from "./types/getRecycleUser"
import type { GetRecycleRole } from "./types/getRecycleRole"
import type { GetRecycleGroup } from "./types/getRecycleGroup"
import type { GetRecyclePermission } from "./types/getRecyclePermission"
import type { GetRecycleMenu } from "./types/getRecycleMenu"
import type { SearchUserQuery } from "./types/searchUserQuery"
import type { OrdinarySearchQuery } from "../types/ordinarySearchQuery"
// 统一管理 api
enum API {
  users = "/admin/recycle/user",
  restoreUser = "/admin/recycle/user/restore",
  roles = "/admin/recycle/role",
  restoreRole = "/admin/recycle/role/restore",
  groups = "/admin/recycle/group",
  restoreGroup = "/admin/recycle/group/restore",
  permissions = "/admin/recycle/permission",
  restorePermission = "/admin/recycle/permission/restore",
  menus = "/admin/recycle/menu",
  restoreMenu = "/admin/recycle/menu/restore",
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
// 恢复 用户 需要对应的权限
export const managerRestoreUser = (id: number) =>
  request.put<any, void>(server + prefix + API.restoreUser + `/${id}`)

// 获取 回收站的 角色 列表
export const recycleAllRoles = (data: OrdinarySearchQuery) =>
  request.get<any, GetRecycleRole["data"]>(
    server + prefix + API.roles + `/?${new URLSearchParams(data)}`
  )
// 恢复 角色 需要对应的权限
export const managerRestoreRole = (id: number) =>
  request.put<any, void>(server + prefix + API.restoreRole + `/${id}`)

// 获取 回收站的 权限组 列表
export const recycleAllGroups = (data: OrdinarySearchQuery) =>
  request.get<any, GetRecycleGroup["data"]>(
    server + prefix + API.groups + `/?${new URLSearchParams(data)}`
  )
// 恢复 权限组 需要对应的权限
export const managerRestoreGroup = (id: number) =>
  request.put<any, void>(server + prefix + API.restoreGroup + `/${id}`)

// 获取 回收站的 权限 列表
export const recycleAllPermissions = (data: OrdinarySearchQuery) =>
  request.get<any, GetRecyclePermission["data"]>(
    server + prefix + API.permissions + `/?${new URLSearchParams(data)}`
  )
// 恢复 权限 需要对应的权限
export const managerRestorePermission = (id: number) =>
  request.put<any, void>(server + prefix + API.restorePermission + `/${id}`)

// 获取 回收站的 菜单 列表
export const recycleAllMenus = (data: OrdinarySearchQuery) =>
  request.get<any, GetRecycleMenu["data"]>(
    server + prefix + API.menus + `/?${new URLSearchParams(data)}`
  )
// 恢复 菜单 需要对应的权限
export const managerRestoreMenu = (id: number) =>
  request.put<any, void>(server + prefix + API.restoreMenu + `/${id}`)

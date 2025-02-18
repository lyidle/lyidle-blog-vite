import request from "@/utils/request"
// 引入类型
/* 
  set的最后是携带的参数类型
*/
import type { GetMenuList } from "@/api/admin/types/getMenuList"
import type { GetAnnounce } from "@/api/admin/types/getAnnounce"
import type { SetAnnounce } from "@/api/admin/types/setAnnounce"
import type { SetAnnounceBody } from "@/api/admin/types/setAnnounceBody"
import type { SetMenuList } from "@/api/admin/types/setMenuList"
import type { SetMenuListBody } from "@/api/admin/types/setMenuListBody"
import type { GetPoetry } from "@/api/admin/types/getPoetry"
import type { FindOneSetting } from "@/api/admin/types/findOneSetting"
import { paginationQuery } from "../types/paginationQuery"
import { FindAllRolesPagination } from "./types/findAllRolesPagination"
import { FindAllRoles } from "./types/findAllRoles"
import { CreateRoleBody } from "./types/createRoleBody"
import { UpdateRoleBody } from "./types/updateRoleBody"
import { FindAllGroups } from "./types/findAllGroups"
import { SetRoleGroupsBody } from "./types/setRoleGroupsBody"

// 统一管理 api
enum API {
  menuList = "/admin/menuList",
  announce = "/admin/announce",
  poetry = "/admin/poetry",
  webInfo = "/webinfo",
  findOneSetting = "/admin/settings",
  findAllRoles = "/admin/role",
  findAllRolesPagination = "/admin/role/pagination",
  Role = "/admin/role",
  removeRole = "/admin/role/bin",
  deleteRole = "/admin/role/clear",
  findAllGroups = "/admin/permissionGroup",
  setRoleGroups = "/admin/role/setGroups",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 获取菜单
export const getMenuList = (roles: string[] = ["user"]) =>
  request.get<any, GetMenuList["data"]>(
    server + prefix + API.menuList + `/?roles=${JSON.stringify(roles)}`
  )
// 设置菜单
export const setMenuList = (data: SetMenuListBody) =>
  request.post<any, SetMenuList>(server + prefix + API.menuList, { data })

// 获取公告
export const getAnnounce = () =>
  request.get<any, GetAnnounce["data"]>(server + prefix + API.announce)
// 设置公告
export const setAnnounce = (data: SetAnnounceBody) =>
  request.put<any, SetAnnounce>(server + prefix + API.announce, { data })

// 获取短诗
export const getPoetry = () =>
  request.get<any, GetPoetry["data"]>(server + prefix + API.poetry)

// 获取设置信息
export const findOneSetting = (name: string) =>
  request.get<any, FindOneSetting["data"]>(
    server + prefix + API.findOneSetting + `?name=${name}`
  )

// 获取 所有的角色信息
export const findAllRoles = () =>
  request.get<any, FindAllRoles["data"]>(server + prefix + API.findAllRoles)

// 获取 所有的角色信息
export const findAllRolesPagination = (data?: paginationQuery) =>
  request.get<any, FindAllRolesPagination["data"]>(
    server +
      prefix +
      API.findAllRolesPagination +
      `/?currentPage=${data?.currentPage || 1}&pageSize=${data?.pageSize || 10}`
  )

// 创建角色 登录用户需要拥有权限
export const createRole = (data: CreateRoleBody) =>
  request.post<any, void>(server + prefix + API.Role, data)

// 更新角色 登录用户需要拥有权限
export const updateRole = (data: UpdateRoleBody) =>
  request.put<any, void>(server + prefix + API.Role, data)

// 删除的回调
const removeCallback = (api: APIKeysType) => (id: number) =>
  request.delete<any, void>(server + prefix + API[api], { data: { id } })

// 彻底删除 登录用户需要拥有权限
export const deleteRole = removeCallback("deleteRole")

// 软删除 登录用户需要拥有权限
export const removeRole = removeCallback("removeRole")

// 查询所有 权限组 登录用户需要拥有权限
export const findAllGroups = () =>
  request.get<any, FindAllGroups["data"]>(server + prefix + API.findAllGroups)

// 分配角色的权限组
export const setRoleGroups = (data: SetRoleGroupsBody) =>
  request.post<any, void>(server + prefix + API.setRoleGroups, data)

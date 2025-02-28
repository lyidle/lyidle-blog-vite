import request from "@/utils/request"
// 引入类型
/* 
  set的最后是携带的参数类型
*/
import type { GetMenuList } from "@/api/admin/types/getMenuList"
import type { GetAnnounce } from "@/api/admin/types/getAnnounce"
import type { GetPoetry } from "@/api/admin/types/getPoetry"
import type { FindOneSetting } from "@/api/admin/types/findOneSetting"
import { paginationQuery } from "../types/paginationQuery"
import { FindAllRolesPagination } from "./types/findAllRolesPagination"
import { FindAllRoles } from "./types/findAllRoles"
import { CreateRoleBody } from "./types/createRoleBody"
import { UpdateRoleBody } from "./types/updateRoleBody"
import { FindAllGroups } from "./types/findAllGroups"
import { SetRoleGroupsBody } from "./types/setRoleGroupsBody"
import { FindAllGroupsPagination } from "./types/findAllGroupsPagination"
import { FindAllPermissions } from "./types/findAllPermissions"
import { SetGroupPermissionsBody } from "./types/setGroupPermissionsBody"
import { FindAllPermissionsPagination } from "./types/findAllPermissionsPagination"
import { CreateMenuListBody } from "./types/createMenuListBody"
import { CreateAnnounceBody } from "./types/createAnnounceBody"
import { CreateAnnounce } from "./types/createAnnounce"
import { UpdateMenuListBody } from "./types/updateMenuListBody"
import { GetBannerImg } from "./types/getBannerImg"
import { UpdateBannerImg } from "./types/updateBannerImg"
import { GetBannerImgPagination } from "./types/getBannerImgPagination"
import { GetBannerImgPaginationQuery } from "./types/getBannerImgPaginationQuery"

// 统一管理 api
enum API {
  menuList = "/admin/menuList",
  managerRemoveMenuList = "/admin/menuList/bin/manager",
  managerDeleteMenuList = "/admin/menuList/clear/manager",
  allMenuList = "/admin/menuList/*",
  announce = "/admin/announce",
  poetry = "/admin/poetry",
  webInfo = "/webinfo",
  findOneSetting = "/admin/settings",
  // 角色
  Role = "/admin/role",
  findAllRoles = "/admin/role",
  findAllRolesPagination = "/admin/role/pagination",
  // 删除
  managerRemoveRole = "/admin/role/bin/manager",
  managerDeleteRole = "/admin/role/clear/manager",
  // 设置 权限组
  managerSetRoleGroups = "/admin/role/setGroups",
  // 权限组
  Group = "/admin/permissionGroup",
  findAllGroups = "/admin/permissionGroup",
  findAllGroupsPagination = "/admin/permissionGroup/pagination",
  // 删除
  managerRemoveGroups = "/admin/permissionGroup/bin/manager",
  managerDeleteGroups = "/admin/permissionGroup/clear/manager",
  // 设置 权限
  managerSetGroupPermissions = "/admin/permissionGroup/setPermissions",
  // 权限
  Permission = "/admin/permissionGroup/permission",
  findAllPermissions = "/admin/permissionGroup/permission",
  findAllPermissionsPagination = "/admin/permissionGroup/permission/pagination",
  // 删除
  managerDeletePermission = "/admin/permissionGroup/permission/clear/manager",
  managerRemovePermission = "/admin/permissionGroup/permission/bin/manager",
  // 背景
  bannerImg = "/admin/bannerImg",
  bannerImgPagination = "/admin/bannerImg/manager",
  // 禁用背景
  bannerImgRecycle = "/admin/bannerImg/recycle",
  // 恢复背景
  bannerImgRestore = "/admin/bannerImg/restore",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 删除的回调
const removeCallback = (api: APIKeysType) => (id: number) =>
  request.delete<any, void>(server + prefix + API[api], { data: { id } })

// 获取菜单 按照权限获取菜单 加了redis缓存
export const getMenuList = (roles: string[] = ["user"]) =>
  request.get<any, GetMenuList["data"]>(
    server + prefix + API.menuList + `/?roles=${JSON.stringify(roles)}`
  )
// 获取所有菜单
export const getAllMenuList = () =>
  request.get<any, GetMenuList["data"]>(server + prefix + API.allMenuList)
// 创建菜单
export const createMenuList = (data: CreateMenuListBody) =>
  request.post<any, void>(server + prefix + API.menuList, data)
// 更新菜单
export const updateMenuList = (data: UpdateMenuListBody) =>
  request.put<any, void>(server + prefix + API.menuList, data)
// 软删除菜单
export const managerRemoveMenuList = removeCallback("managerRemoveMenuList")
// 彻底删除菜单
export const managerDeleteMenuList = removeCallback("managerDeleteMenuList")

// 获取公告
export const getAnnounce = () =>
  request.get<any, GetAnnounce["data"]>(server + prefix + API.announce)
// 创建公告
export const createAnnounce = (data: CreateAnnounceBody) =>
  request.put<any, CreateAnnounce>(server + prefix + API.announce, data)

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

// 获取 所有的角色信息 分页器
export const findAllRolesPagination = (data?: paginationQuery) =>
  request.get<any, FindAllRolesPagination["data"]>(
    server +
      prefix +
      API.findAllRolesPagination +
      `/?currentPage=${data?.currentPage || 1}&pageSize=${
        data?.pageSize || 10
      }` +
      `${data?.name ? `&name=${data.name}` : ""}`
  )

// 创建角色 登录用户需要拥有权限
export const createRole = (data: CreateRoleBody) =>
  request.post<any, void>(server + prefix + API.Role, data)

// 更新角色 登录用户需要拥有权限
export const updateRole = (data: UpdateRoleBody) =>
  request.put<any, void>(server + prefix + API.Role, data)

// 彻底删除角色 登录用户需要拥有权限
export const managerDeleteRole = removeCallback("managerDeleteRole")

// 软删除角色 登录用户需要拥有权限
export const managerRemoveRole = removeCallback("managerRemoveRole")

// 查询所有 权限组 登录用户需要拥有权限
export const findAllGroups = () =>
  request.get<any, FindAllGroups["data"]>(server + prefix + API.findAllGroups)

// 分配角色的权限组
export const managerSetRoleGroups = (data: SetRoleGroupsBody) =>
  request.post<any, void>(server + prefix + API.managerSetRoleGroups, data)

// 获取 所有的权限组信息 分页器
export const findAllGroupsPagination = (data?: paginationQuery) =>
  request.get<any, FindAllGroupsPagination["data"]>(
    server +
      prefix +
      API.findAllGroupsPagination +
      `/?currentPage=${data?.currentPage || 1}&pageSize=${
        data?.pageSize || 10
      }` +
      `${data?.name ? `&name=${data.name}` : ""}`
  )

// 彻底删除权限组 登录用户需要拥有权限
export const managerDeleteGroups = removeCallback("managerDeleteGroups")

// 软删除权限组 登录用户需要拥有权限
export const managerRemoveGroups = removeCallback("managerRemoveGroups")

// 创建权限组 登录用户需要拥有权限
export const createGroup = (data: CreateRoleBody) =>
  request.post<any, void>(server + prefix + API.Group, data)

// 更新权限组 登录用户需要拥有权限
export const updateGroup = (data: UpdateRoleBody) =>
  request.put<any, void>(server + prefix + API.Group, data)

// 获取 所有的权限信息
export const findAllPermissions = () =>
  request.get<any, FindAllPermissions["data"]>(
    server + prefix + API.findAllPermissions
  )

// 分配权限组的权限
export const managerSetGroupPermissions = (data: SetGroupPermissionsBody) =>
  request.post<any, void>(
    server + prefix + API.managerSetGroupPermissions,
    data
  )

// 获取 所有的权限信息 分页器
export const findAllPermissionsPagination = (data?: paginationQuery) =>
  request.get<any, FindAllPermissionsPagination["data"]>(
    server +
      prefix +
      API.findAllPermissionsPagination +
      `/?currentPage=${data?.currentPage || 1}&pageSize=${
        data?.pageSize || 10
      }` +
      `${data?.name ? `&name=${data.name}` : ""}`
  )

// 彻底删除权限 登录用户需要拥有权限
export const managerDeletePermission = removeCallback("managerDeletePermission")

// 软删除权限 登录用户需要拥有权限
export const managerRemovePermission = removeCallback("managerRemovePermission")

// 创建权限 登录用户需要拥有权限
export const managerCreatePermission = (data: CreateRoleBody) =>
  request.post<any, void>(server + prefix + API.Permission, data)

// 更新权限组 登录用户需要拥有权限
export const managerUpdatePermission = (data: UpdateRoleBody) =>
  request.put<any, void>(server + prefix + API.Permission, data)

// 得到背景
export const getBannerImg = (isBin: boolean = false) =>
  request.get<any, GetBannerImg["data"]>(
    server +
      prefix +
      API.bannerImg +
      `/?isBin=${isBin ? JSON.stringify(true) : JSON.stringify(false)}`
  )

export const getBannerImgPagination = (data: GetBannerImgPaginationQuery) =>
  request.get<any, GetBannerImgPagination["data"]>(
    server +
      prefix +
      API.bannerImgPagination +
      `/?isBin=${JSON.stringify(true)}` +
      `&currentPage=${data.currentPage || 1}` +
      `&pageSize=${data.pageSize || 10}` +
      `${data.name ? `&name=${data.name}` : ""}`
  )
// 更新背景 登录用户需要拥有权限
export const managerUpdateBannerImg = (data: UpdateBannerImg) =>
  request.put<any, void>(server + prefix + API.bannerImg, data)

// 禁用背景 登录用户需要拥有权限
export const managerRecycleBannerImg = (id: number) =>
  request.put<any, void>(server + prefix + API.bannerImgRecycle + `/${id}`)

// 恢复背景 登录用户需要拥有权限
export const managerRestoreBannerImg = (id: number) =>
  request.put<any, void>(server + prefix + API.bannerImgRestore + `/${id}`)

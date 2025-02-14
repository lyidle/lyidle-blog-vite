"use strict"

// 导入环境变量
require("dotenv").config()

// 生成的角色的环境变量
const seeder_roles = JSON.parse(process.env.seeder_roles)
// 生成的权限组的环境变量
const seeder_permission_group = JSON.parse(process.env.seeder_permission_group)
// 生成的权限的环境变量
const seeder_permissions = JSON.parse(process.env.seeder_permissions)

// 角色和权限组的映射关系
const rolePermissionGroups = {
  owner: JSON.parse(process.env.seeder_owner_group), // owner 角色拥有的权限组
  admin: JSON.parse(process.env.seeder_admin_group), // admin 角色拥有的权限组
  user: JSON.parse(process.env.seeder_user_group), // user 角色拥有的权限组
}

// 模拟的 roles 数据
const Roles = seeder_roles.map((item, id) => ({
  id: id + 1,
  name: item,
  createdAt: new Date(),
  updatedAt: new Date(),
}))

// 模拟的权限组数据
const PermissionGroups = seeder_permission_group.map((item, id) => ({
  id: id + 1,
  name: item,
  createdAt: new Date(),
  updatedAt: new Date(),
}))

// 模拟的权限数据
const Permissions = seeder_permissions.map((item, id) => ({
  id: id + 1,
  name: item,
  createdAt: new Date(),
  updatedAt: new Date(),
}))

// 设置中间表信息，建立角色和权限组的关联
const setRolePermissionGroups = []

// 定义权限组和权限的映射关系
const permissionGroupPermissions = {
  user: ["user:read", "user:write"], // user 权限组包含的权限
  menu: ["menu:read", "menu:write"], // menu 权限组包含的权限
}

// 遍历角色，动态生成 RolePermissionGroups 数据
Roles.forEach((role) => {
  const roleName = role.name
  const permissionGroups = rolePermissionGroups[roleName]

  if (permissionGroups) {
    permissionGroups.forEach((groupName) => {
      const permissionGroup = PermissionGroups.find(
        (pg) => pg.name === groupName
      )

      if (permissionGroup) {
        setRolePermissionGroups.push({
          RoleId: role.id,
          PermissionGroupId: permissionGroup.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    })
  }
})

// 插入权限组和权限的关联数据
const setPermissionGroupPermissions = []

Object.entries(permissionGroupPermissions).forEach(
  ([groupName, permissionNames]) => {
    const permissionGroup = PermissionGroups.find((pg) => pg.name === groupName)

    if (permissionGroup) {
      permissionNames.forEach((permissionName) => {
        const permission = Permissions.find((p) => p.name === permissionName)

        if (permission) {
          setPermissionGroupPermissions.push({
            PermissionGroupId: permissionGroup.id,
            PermissionId: permission.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      })
    }
  }
)

module.exports = {
  Roles,
  PermissionGroups,
  Permissions,
  setRolePermissionGroups,
  permissionGroupPermissions,
  setPermissionGroupPermissions,
}

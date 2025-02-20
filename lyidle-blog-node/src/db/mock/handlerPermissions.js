require("dotenv").config()

const roles = JSON.parse(process.env.seeder_roles || "[]")
const permissionGroups = JSON.parse(process.env.seeder_permission_group || "[]")
const permissions = JSON.parse(process.env.seeder_permissions || "[]")

// 默认的 角色
const default_owner = process.env.default_owner
const default_user = process.env.default_user
const default_admin = process.env.default_admin

// 生成角色数据
const Roles = roles.map((role, index) => ({
  id: index + 1,
  name: role,
  createdAt: new Date(),
  updatedAt: new Date(),
}))

// 生成权限组数据
const PermissionGroups = permissionGroups.map((group, index) => ({
  id: index + 1,
  name: group,
  createdAt: new Date(),
  updatedAt: new Date(),
}))

// 生成权限数据
const Permissions = permissions.map((perm, index) => ({
  id: index + 1,
  name: perm,
  createdAt: new Date(),
  updatedAt: new Date(),
}))

// 角色和权限组的映射关系
const RolePermissionGroups = []
Roles.forEach((role) => {
  PermissionGroups.forEach((group) => {
    if (role.name === group.name) {
      RolePermissionGroups.push({
        roleId: role.id,
        permissionGroupId: group.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  })
})

// 权限组和权限的映射关系
const PermissionGroupPermissions = []
PermissionGroups.forEach((group) => {
  Permissions.forEach((perm) => {
    if (
      // admin和owner拥有所有权限
      group.name === default_owner ||
      group.name === default_admin ||
      // user 拥有 read 字段的权限
      (group.name === default_user && perm.name.includes("read"))
    ) {
      PermissionGroupPermissions.push({
        permissionGroupId: group.id,
        permissionId: perm.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  })
})

module.exports = {
  Roles,
  PermissionGroups,
  Permissions,
  RolePermissionGroups,
  PermissionGroupPermissions,
}

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

// 动态生成权限组和权限的映射关系
const permissionGroupPermissions = {}

seeder_permissions.forEach((permission) => {
  // 解析权限名称，获取权限组名称（例如 "user:read" 中的 "user"）
  const [groupName] = permission.split(":")

  // 如果权限组不存在，则初始化一个空数组
  if (!permissionGroupPermissions[groupName]) {
    permissionGroupPermissions[groupName] = []
  }

  // 将权限添加到对应的权限组中
  permissionGroupPermissions[groupName].push(permission)
})

// 遍历角色，动态生成 RolePermissionGroups 数据
// 角色与权限组的关联信息处理
Roles.forEach((role) => {
  // 获取当前角色的名称
  const roleName = role.name
  // 根据角色名称获取该角色对应的权限组列表
  let permissionGroups = rolePermissionGroups[roleName]

  // 如果该角色有对应的权限组
  if (permissionGroups) {
    // 遍历该角色的权限组列表
    permissionGroups.forEach((groupName) => {
      // 在 PermissionGroups 中查找与当前权限组名称匹配的权限组对象
      const permissionGroup = PermissionGroups.find(
        (pg) => pg.name === groupName
      )

      // 如果找到了对应的权限组
      if (permissionGroup) {
        // 将角色与权限组的关联信息推入 setRolePermissionGroups 数组
        setRolePermissionGroups.push({
          RoleId: role.id, // 角色 ID
          PermissionGroupId: permissionGroup.id, // 权限组 ID
          createdAt: new Date(), // 创建时间
          updatedAt: new Date(), // 更新时间
        })
      }
    })
  }
})

// 插入权限组和权限的关联数据
const setPermissionGroupPermissions = []

Object.entries(permissionGroupPermissions).forEach(
  ([groupName, permissionNames]) => {
    // 在 PermissionGroups 中查找与当前权限组名称匹配的权限组对象
    const permissionGroup = PermissionGroups.find((pg) => pg.name === groupName)

    // 如果找到了对应的权限组
    if (permissionGroup) {
      // 遍历该权限组对应的权限名称列表
      permissionNames.forEach((permissionName) => {
        // 在 Permissions 中查找与当前权限名称匹配的权限对象
        const permission = Permissions.find((p) => p.name === permissionName)

        // 如果找到了对应的权限
        if (permission) {
          // 将权限组与权限的关联信息推入 setPermissionGroupPermissions 数组
          setPermissionGroupPermissions.push({
            PermissionGroupId: permissionGroup.id, // 权限组 ID
            PermissionId: permission.id, // 权限 ID
            createdAt: new Date(), // 创建时间
            updatedAt: new Date(), // 更新时间
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

"use strict"

// 引入 处理好的信息
const {
  Roles,
  PermissionGroups,
  Permissions,
  RolePermissionGroups,
  PermissionGroupPermissions,
} = require("../mock/handlerPermissions")

module.exports = {
  async up(queryInterface, Sequelize) {
    // 插入角色数据
    await queryInterface.bulkInsert("Roles", Roles, {})

    // 插入权限组数据
    await queryInterface.bulkInsert("PermissionGroups", PermissionGroups, {})

    // 插入权限数据
    await queryInterface.bulkInsert("Permissions", Permissions, {})

    // 插入角色和权限组的关联数据
    await queryInterface.bulkInsert(
      "RolePermissionGroups",
      RolePermissionGroups,
      {}
    )

    // 插入权限组和权限的关联数据
    await queryInterface.bulkInsert(
      "PermissionGroupPermissions",
      PermissionGroupPermissions,
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    // 删除权限组和权限的关联数据
    await queryInterface.bulkDelete("PermissionGroupPermissions", null, {})

    // 删除角色和权限组的关联数据
    await queryInterface.bulkDelete("RolePermissionGroups", null, {})

    // 删除权限数据
    await queryInterface.bulkDelete("Permissions", null, {})

    // 删除权限组数据
    await queryInterface.bulkDelete("PermissionGroups", null, {})

    // 删除角色数据
    await queryInterface.bulkDelete("Roles", null, {})
  },
}

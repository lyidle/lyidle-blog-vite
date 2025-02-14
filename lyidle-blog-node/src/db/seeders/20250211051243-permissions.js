"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    const permissions = [
      { id: 1, name: "user", description: "用户管理", parentId: null },
      { id: 2, name: "user:create", description: "允许创建用户", parentId: 1 },
      { id: 3, name: "user:delete", description: "允许删除用户", parentId: 1 },
      { id: 4, name: "user:update", description: "允许更新用户", parentId: 1 },
      { id: 5, name: "user:read", description: "允许查看用户", parentId: 1 },

      { id: 6, name: "menu", description: "菜单管理", parentId: null },
      { id: 7, name: "menu:create", description: "允许创建菜单", parentId: 6 },
      { id: 8, name: "menu:delete", description: "允许删除菜单", parentId: 6 },
      { id: 9, name: "menu:update", description: "允许更新菜单", parentId: 6 },
      { id: 10, name: "menu:read", description: "允许查看菜单", parentId: 6 },
    ]

    // 添加时间戳
    const setPermissions = permissions.map((item) => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    await queryInterface.bulkInsert("Permissions", setPermissions, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Permissions", null, {})
  },
}

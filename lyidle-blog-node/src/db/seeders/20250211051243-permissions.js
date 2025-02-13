"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    // 初始化权限数据
    const permissions = [
      { name: "create:user", description: "允许创建用户" },
      { name: "delete:user", description: "允许删除用户" },
      { name: "update:user", description: "允许更新用户" },
      { name: "read:user", description: "允许查看用户" },
      { name: "create:menu", description: "允许创建菜单" },
      { name: "delete:menu", description: "允许删除菜单" },
      { name: "update:menu", description: "允许更新菜单" },
      { name: "read:menu", description: "允许查看菜单" },
    ]

    const setPermissions = permissions.map((item, id) => ({
      id: id + 1,
      name: item.name,
      description: item.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    await queryInterface.bulkInsert("Permissions", setPermissions, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Permissions", null, {})
  },
}

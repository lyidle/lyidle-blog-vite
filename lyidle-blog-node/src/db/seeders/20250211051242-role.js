"use strict"

// 导入环境变量
require("dotenv").config()
// 生成 的 权限表
const seeder_roles = JSON.parse(process.env.seeder_roles)

module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = seeder_roles

    const setRoles = roles.map((item, id) => ({
      id: id + 1,
      name: item,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    await queryInterface.bulkInsert("Roles", setRoles, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Roles", null, {})
  },
}

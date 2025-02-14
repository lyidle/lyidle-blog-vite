"use strict"

// 引入 处理好的信息
const { users, userRoles } = require("../mock/handlerUsers")

module.exports = {
  async up(queryInterface, Sequelize) {
    // 插入用户信息
    await queryInterface.bulkInsert("Users", users, {})
    // 插入用户 关联的角色信息
    await queryInterface.bulkInsert("UserRoles", userRoles, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserRoles", null, {})
    await queryInterface.bulkDelete("Users", null, {})
  },
}

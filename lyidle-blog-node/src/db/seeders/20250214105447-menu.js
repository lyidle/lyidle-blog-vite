"use strict"

// 引入 处理好的信息
const { menus, menuRoles } = require("../mock/handlerMenus")

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Menus", menus, {})
    await queryInterface.bulkInsert("MenuRoles", menuRoles, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("MenuRoles", null, {})
    await queryInterface.bulkDelete("Menus", null, {})
  },
}

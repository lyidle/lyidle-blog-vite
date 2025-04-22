"use strict"

// 引入处理好的信息
const { menus, menuRoles } = require("../mock/handlerMenus")
// 引入 模型文件
const { Menu } = require("../models")
module.exports = {
  async up(queryInterface, Sequelize) {
    // 逐条插入 Menu 数据，触发钩子
    for (const menu of menus) {
      try {
        await Menu.create(menu)
      } catch (error) {
        console.error(error)
      }
    }

    // 批量插入 MenuRole 数据（不需要触发钩子）
    await queryInterface.bulkInsert("MenuRoles", menuRoles, {})
  },

  async down(queryInterface, Sequelize) {
    // 删除 MenuRole 数据
    await queryInterface.bulkDelete("MenuRoles", null, {})

    // 删除 Menu 数据
    await queryInterface.bulkDelete("Menus", null, {})
  },
}

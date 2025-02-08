"use strict"

const data = require("../mock/menulist")
require("dotenv").config()
const { clear } = require("../../utils/redis/js")

module.exports = {
  async up(queryInterface, Sequelize) {
    if (!data.length) {
      await clear()
      return
    }

    let menuId = 1 // 记录自增 ID
    const menus = []

    // 递归处理菜单
    function processMenu(menu, parentId = null) {
      const currentId = menuId++

      menus.push({
        id: currentId,
        name: menu.name,
        icon: menu.icon,
        to: menu.to,
        parentId: parentId,
        role: JSON.stringify(menu.role ?? ["user", "admin"]),
        bannerImg: JSON.stringify(menu.bannerImg),
        layout: JSON.stringify(menu.layout),
      })

      // 递归处理子菜单
      if (menu.children && Array.isArray(menu.children)) {
        menu.children.forEach((child) => processMenu(child, currentId))
      }
    }

    data.forEach((menu) => processMenu(menu))

    await queryInterface.bulkInsert("Menus", menus, {})
    await clear()
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Menus", null, {})
  },
}

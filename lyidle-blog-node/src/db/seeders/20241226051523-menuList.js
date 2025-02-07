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

    const menus = data.map((menu, index) => ({
      id: index + 1,
      name: menu.name,
      icon: menu.icon,
      to: menu.to,
      parentId: menu.parentId,
      role: JSON.stringify(["user", "admin"]),
      bannerImg: JSON.stringify(menu.bannerImg), // 处理 bannerImg
    }))

    await queryInterface.bulkInsert("Menus", menus, {})
    await clear()
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Menus", null, {})
  },
}

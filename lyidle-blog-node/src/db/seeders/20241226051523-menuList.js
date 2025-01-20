"use strict"
const data = require("../mock/menulist")
/** @type {import('sequelize-cli').Migration} */
// 导入环境变量
require("dotenv").config()
// 引入 redis 清理函数
const { clear } = require("../../utils/redis")
module.exports = {
  async up(queryInterface, Sequelize) {
    const menuList = []
    let menu = data.map((item, id) => {
      if (item.children) {
        menuList.push(
          ...item.children.map((item) => ({
            menuId: id + 1,
            name: item.name ?? `${id + 1}`,
            routeName: item.routeName,
            icon: item.icon ?? `${id + 1}`,
            to: item.to ?? `/test/${id + 1}`,
            bannerImg: JSON.stringify(item.bannerImg),
          }))
        )
      }
      return {
        name: item.name ?? `${id + 1}`,
        icon: item.icon ?? `${id + 1}`,
        to: item?.to,
        bannerImg: JSON.stringify(item.bannerImg),
        layout: JSON.stringify(item.layout),
        role: JSON.stringify([...new Set([item.role].flat(Infinity))]),
        routeName: item.routeName,
      }
    })
    await queryInterface.bulkInsert("Menus", menu, {})
    await queryInterface.bulkInsert("MenuLists", menuList, {})
    await clear()
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Menus", null, {})
    await queryInterface.bulkDelete("MenuLists", null, {})
  },
}

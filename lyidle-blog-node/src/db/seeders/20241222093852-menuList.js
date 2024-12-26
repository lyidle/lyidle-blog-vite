"use strict"
const data = require("../mock/menulist")
/** @type {import('sequelize-cli').Migration} */
const default_user = JSON.parse(process.env.default_user)
module.exports = {
  async up(queryInterface, Sequelize) {
    const menuList = []
    let menu = data.map((item, id) => {
      if (item.children) {
        menuList.push(
          ...item.children.map((item) => ({
            menuId: id,
            name: item.name ?? `${id + 1}`,
            icon: item.icon ?? `${id + 1}`,
            to: item.to ?? `/test/${id + 1}`,
            bannerImg: JSON.stringify(item.bannerImg),
          }))
        )
      }
      return {
        name: item.name ?? `${id + 1}`,
        icon: item.icon ?? `${id + 1}`,
        to: item.to ?? `/test/${id + 1}`,
        bannerImg: JSON.stringify(item.bannerImg),
        layout: JSON.stringify(item.layout),
      }
    })
    await queryInterface.bulkInsert("Menus", menu, {})
    await queryInterface.bulkInsert("MenuLists", menuList, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Menus", null, {})
    await queryInterface.bulkDelete("MenuLists", null, {})
  },
}

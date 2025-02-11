"use strict"
const menuData = require("../mock/menulist")

module.exports = {
  async up(queryInterface, Sequelize) {
    let menuId = 1
    const menus = []
    const menuRoles = []

    function processMenu(menu, parentId = null) {
      const currentId = menuId++
      const roles = menu.roles ?? [2] // 默认给 admin 和 环境变量 seeder_roles 对应

      menus.push({
        id: currentId,
        name: menu.name,
        icon: menu.icon,
        to: menu.to,
        parentId,
        bannerImg: JSON.stringify(menu.bannerImg),
        layout: JSON.stringify(menu.layout),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      roles.forEach((roleId) => {
        menuRoles.push({
          menuId: currentId,
          roleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })

      if (menu.children) {
        menu.children.forEach((child) => processMenu(child, currentId))
      }
    }

    menuData.forEach((menu) => processMenu(menu))

    await queryInterface.bulkInsert("Menus", menus, {})
    await queryInterface.bulkInsert("MenuRoles", menuRoles, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("MenuRoles", null, {})
    await queryInterface.bulkDelete("Menus", null, {})
  },
}

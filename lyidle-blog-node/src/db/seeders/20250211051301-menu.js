"use strict"
const menuData = require("../mock/menulist")
// 引入 模型
const { Role } = require("../models")

// 引入 去重函数
const { deduplication } = require("../../utils/array/deduplication/js")

// 生成 的 权限表
const default_owner = JSON.parse(process.env.default_owner)
const default_user = JSON.parse(process.env.default_user)
const seeder_admin = JSON.parse(process.env.seeder_admin)

// 处理 设置 的 role
const handlerRole = (roles, setRoles) => {
  return setRoles.map((item) => roles[item])
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // 获取所有的 roles 建立映射关系
    const findRoles = await Role.findAll({
      attributes: ["id", "name"],
    })

    // 处理成 名字 对应 id 的形式
    const roles = findRoles.reduce((pre, cur) => {
      const item = cur.dataValues
      pre[item.name] = item.id
      return pre
    }, {})

    const adminIds = deduplication(handlerRole(roles, seeder_admin))
    const userIds = deduplication(handlerRole(roles, default_user))
    const ownerIds = deduplication(adminIds, handlerRole(roles, default_owner))

    let currentId = 1
    const menus = []
    const menuRoles = []

    function processMenu(menu, parentId = null) {
      const menuId = currentId++
      const menuRole = handlerRole(roles, menu.role)
      const $roles = (menuRole.length ? menuRole : userIds) || userIds
      menus.push({
        id: menuId,
        name: menu.name + menuId,
        icon: menu.icon,
        to: menu.to,
        parentId,
        bannerImg: JSON.stringify(menu.bannerImg),
        layout: JSON.stringify(menu.layout),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      $roles.forEach((roleId) => {
        menuRoles.push({
          menuId,
          roleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })

      if (menu.children) {
        menu.children.forEach((child) => processMenu(child, menuId))
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

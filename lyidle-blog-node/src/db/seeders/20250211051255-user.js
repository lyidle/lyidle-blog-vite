"use strict"

// 加密
const bcrypt = require("bcryptjs")
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

    const users = []
    const userRoles = []
    const userCounts = 10
    for (let i = 1; i <= userCounts; i++) {
      const userId = i
      // 默认 是 user
      let roleIds = userIds
      // 第一个是 owner
      if (i === 1) roleIds = ownerIds
      // 第二个是 admin
      if (i === 2) roleIds = adminIds
      users.push({
        id: userId,
        account: `test${i}`,
        nickName: `User ${i}`,
        pwd: bcrypt.hashSync("123456", 10),
        email: `user${i}@example.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      roleIds.forEach((item) => {
        userRoles.push({
          userId,
          roleId: item,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
    }

    await queryInterface.bulkInsert("Users", users, {})
    await queryInterface.bulkInsert("UserRoles", userRoles, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserRoles", null, {})
    await queryInterface.bulkDelete("Users", null, {})
  },
}

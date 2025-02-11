"use strict"
const bcrypt = require("bcryptjs")

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = []
    const userRoles = []
    const userCounts = 10
    for (let i = 1; i <= userCounts; i++) {
      const userId = i
      // 和 环境变量 seeder_roles 对应
      // 默认 是 user
      let roleIds = [3]
      // 第一个是 owner 和 admin
      if (i === 1) roleIds = [1, 2]
      // 第二个是 admin
      if (i === 2) roleIds = [2]

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

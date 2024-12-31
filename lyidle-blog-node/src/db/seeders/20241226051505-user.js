"use strict"
const { setKey } = require("../../utils/redis")
const bcrypt = require("bcryptjs")
/** @type {import('sequelize-cli').Migration} */
// 导入环境变量
require("dotenv").config()
// 引入普通用户 权限组
const default_user = JSON.parse(process.env.default_user)
// 引入普通用户 权限组
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = []
    const counts = 50
    const roles = [...new Set(...[default_user, "test", "other"])]
    const setRole = (i) => {
      if (i === 1) return JSON.stringify(["admin"])
      return JSON.stringify([
        ...new Set([roles[Math.floor(Math.random() * roles.length)]]),
      ])
    }
    for (let i = 1; i <= counts; i++) {
      users.push({
        account: `test${i}`,
        nickName: "test",
        pwd: bcrypt.hashSync(`123456`, 10),
        email: `${i}@qq.com`,
        role: setRole(i),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    await setKey("userCounts", counts)
    await queryInterface.bulkInsert("Users", users, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {})
  },
}

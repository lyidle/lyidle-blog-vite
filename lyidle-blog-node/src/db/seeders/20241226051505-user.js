"use strict"
const bcrypt = require("bcryptjs")
/** @type {import('sequelize-cli').Migration} */
// 导入环境变量
const default_user = require("dotenv").config()
// 引入普通用户 权限组
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log(default_user)
    const users = []
    const counts = 50
    const roles = [...new Set(["user", "admin", "other"])]
    const setRole = (i) => {
      if (i === 1) return JSON.stringify(["admin", "webDev"])
      return JSON.stringify([
        ...new Set([roles[Math.floor(Math.random() * roles.length)]]),
      ])
    }
    for (let i = 1; i <= counts; i++) {
      users.push({
        account: `test${i}`,
        nickName: "test",
        pwd: bcrypt.hashSync(`test${i}@Aa`, 10),
        email: `${i}@qq.com`,
        role: setRole(i),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    await queryInterface.bulkInsert("Users", users, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {})
  },
}

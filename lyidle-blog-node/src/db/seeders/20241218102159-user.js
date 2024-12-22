"use strict"
const bcrypt = require("bcryptjs")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = []
    const counts = 50
    const roles = ["user", "admin", "other"]
    for (let i = 1; i <= counts; i++) {
      users.push({
        account: `test${i}`,
        nickName: "test",
        pwd: bcrypt.hashSync(`test${i}@Aa`, 10),
        email: `${i}@qq.com`,
        role: JSON.stringify([roles[Math.floor(Math.random() * roles.length)]]),
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

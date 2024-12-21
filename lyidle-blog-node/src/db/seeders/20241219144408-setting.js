"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Settings",
      [
        {
          name: "announce",
          content:
            "公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "copyright",
          content: "©2022-2023",

          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "createWebAt",
          content: `建站时间`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Settings", null, {})
  },
}

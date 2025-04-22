"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    const results = [
      {
        content:
          "使用vite搭建前端基础的框架和功能\n使用nodejs搭建后端的框架\n初始化搭建用户、权限、评论、举报、消息、背景等管理界面和对应的接口",
        createdAt: new Date("2023-01-10"),
        updatedAt: new Date("2023-01-10"),
      },
    ]

    await queryInterface.bulkInsert("SiteTimes", results, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SiteTimes", null, {})
  },
}

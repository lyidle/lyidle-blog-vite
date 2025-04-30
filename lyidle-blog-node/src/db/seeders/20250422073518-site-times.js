"use strict"

// 引入 清除 redids 缓存的 函数
const { delKeys } = require("../../utils/redis/js")
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
    // 清空 缓存
    await delKeys("")
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SiteTimes", null, {})
  },
}

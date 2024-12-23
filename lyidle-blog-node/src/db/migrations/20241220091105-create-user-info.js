"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserInfos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pages: {
        type: Sequelize.INTEGER,
      },
      tags: {
        type: Sequelize.JSON,
      },
      categories: {
        type: Sequelize.JSON,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // 指向 User 表
          key: "id",
        },
        allowNull: false, // 设置为非空
      },
      totalWords: {
        type: Sequelize.INTEGER,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserInfos")
  },
}

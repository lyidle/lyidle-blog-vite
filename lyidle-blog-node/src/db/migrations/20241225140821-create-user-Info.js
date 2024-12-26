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
        allowNull: false,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      categories: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      totalWords: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // 指向 User 表
          key: "id",
        },
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserInfos")
  },
}

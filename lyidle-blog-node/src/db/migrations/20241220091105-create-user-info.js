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
      articleCounts: {
        type: Sequelize.INTEGER,
      },
      tipArrays: {
        type: Sequelize.JSON,
      },
      categoryArrays: {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserInfos")
  },
}

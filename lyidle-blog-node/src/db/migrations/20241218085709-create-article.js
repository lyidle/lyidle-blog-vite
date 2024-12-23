"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Articles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.TEXT,
      },
      author: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      carousel: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      desc: {
        type: Sequelize.STRING,
      },
      poster: {
        type: Sequelize.TEXT,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // 指向 User 表
          key: "id",
        },
        allowNull: false, // 设置为非空
      },
      length: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable("Articles")
  },
}

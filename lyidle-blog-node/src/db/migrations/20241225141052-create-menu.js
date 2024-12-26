"use strict"
/** @type {import('sequelize-cli').Migration} */
// 引入普通用户 权限组
const default_user = process.env.default_user
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Menus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      icon: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      to: {
        type: Sequelize.STRING,
      },
      layout: {
        type: Sequelize.JSON,
      },
      bannerImg: {
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      role: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: default_user,
        references: {
          model: "Users", // 指向 User 表
          key: "role",
        },
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Menus")
  },
}

"use strict"
/** @type {import('sequelize-cli').Migration} */
// 引入普通用户 权限组
const default_user = process.env.default_user
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      account: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true,
      },
      nickName: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      pwd: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      avater: {
        type: Sequelize.STRING,
      },
      signer: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: default_user,
      },
      token: {
        type: Sequelize.STRING(500),
      },
      status: {
        type: Sequelize.TINYINT,
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
    await queryInterface.dropTable("Users")
  },
}

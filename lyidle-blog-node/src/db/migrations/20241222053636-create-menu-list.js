"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MenuLists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      menuId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Menus", // 指向 User 表
          key: "id",
        },
        allowNull: false, // 设置为非空
      },
      name: {
        type: Sequelize.STRING,
      },
      icon: {
        type: Sequelize.STRING,
      },
      to: {
        type: Sequelize.STRING,
      },
      bannerImg: {
        type: Sequelize.JSON,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MenuLists")
  },
}

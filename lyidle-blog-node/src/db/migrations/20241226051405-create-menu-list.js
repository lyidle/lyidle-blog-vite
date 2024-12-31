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
        allowNull: false,
        references: {
          model: "Menus",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      icon: {
        type: Sequelize.TEXT,
      },
      to: {
        type: Sequelize.STRING,
        allowNull: false,
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

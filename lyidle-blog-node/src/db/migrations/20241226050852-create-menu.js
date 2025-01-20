"use strict"
/** @type {import('sequelize-cli').Migration} */
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
      routeName: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      icon: {
        type: Sequelize.TEXT,
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
      isBin: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      role: {
        type: Sequelize.JSON,
        allowNull: false,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Menus")
  },
}

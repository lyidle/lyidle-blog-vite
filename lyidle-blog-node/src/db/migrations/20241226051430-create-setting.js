"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Settings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      content: {
        type: Sequelize.JSON,
      },
    })
    // 添加普通索引
    await queryInterface.addIndex("Settings", ["name"])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Settings")
  },
}

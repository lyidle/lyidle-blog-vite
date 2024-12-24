"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Articles", "status", {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
    })
    await queryInterface.addColumn("Users", "status", {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Articles", "status")
    await queryInterface.removeColumn("Users", "status")
  },
}

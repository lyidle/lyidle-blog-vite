"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Articles", "deleteAt", {
      type: Sequelize.DATE,
    })
    await queryInterface.addColumn("Emails", "deleteAt", {
      type: Sequelize.DATE,
    })
    await queryInterface.addColumn("UserInfos", "deleteAt", {
      type: Sequelize.DATE,
    })
    await queryInterface.addColumn("Users", "deleteAt", {
      type: Sequelize.DATE,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Articles", "deleteAt")
    await queryInterface.removeColumn("Emails", "deleteAt")
    await queryInterface.removeColumn("UserInfos", "deleteAt")
    await queryInterface.removeColumn("Users", "deleteAt")
  },
}

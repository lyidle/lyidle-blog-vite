"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Emails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      regCode: {
        type: Sequelize.INTEGER,
      },
      forgetCode: {
        type: Sequelize.INTEGER,
      },
      expiresAt: {
        type: Sequelize.DATE,
      },
      // createdAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Emails")
  },
}

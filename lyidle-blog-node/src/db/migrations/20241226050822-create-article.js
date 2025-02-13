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
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(12),
        allowNull: false,
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
      length: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      isBin: {
        type: Sequelize.DATE,
        allowNull: true,
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

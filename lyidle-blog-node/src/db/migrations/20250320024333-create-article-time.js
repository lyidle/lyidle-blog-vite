"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ArticleTimes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      articleId: {
        type: Sequelize.INTEGER,
        unique: true,
        references: {
          model: "Articles",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      time: {
        type: Sequelize.STRING,
        defaultValue: "0",
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
    await queryInterface.dropTable("ArticleTimes")
  },
}

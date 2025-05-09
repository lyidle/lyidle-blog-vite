"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Articles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING(32),
        allowNull: false,
        references: {
          model: "Users",
          key: "account",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      carousel: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      imgUrls: {
        type: Sequelize.JSON,
      },
      articleId: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
        comment: "文章ID 自己手动生成",
      },
      link: {
        type: Sequelize.STRING,
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

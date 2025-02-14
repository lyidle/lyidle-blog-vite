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
        unique: true,
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
        type: Sequelize.DATE,
        allowNull: true,
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true, // 允许为空，表示顶级菜单
        references: {
          model: "Menus", // 自关联
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("Menus")
  },
}

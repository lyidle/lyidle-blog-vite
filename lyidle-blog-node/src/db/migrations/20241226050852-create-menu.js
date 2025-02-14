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
        allowNull: true, // 顶级菜单的 parentId 为 null
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
    // 手动添加外键，确保 ON DELETE CASCADE 生效
    await queryInterface.addConstraint("Menus", {
      fields: ["parentId"],
      type: "foreign key",
      name: "fk_menus_parent",
      references: {
        table: "Menus",
        field: "id",
      },
      onDelete: "CASCADE", // 级联删除
      onUpdate: "CASCADE",
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Menus", "fk_menus_parent")
    await queryInterface.dropTable("Menus")
  },
}

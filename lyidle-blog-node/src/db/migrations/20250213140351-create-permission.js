"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Permissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
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
    await queryInterface.addConstraint("Permissions", {
      fields: ["parentId"],
      type: "foreign key",
      name: "fk_permissions_parent",
      references: {
        table: "Permissions",
        field: "id",
      },
      onDelete: "CASCADE", // 级联删除
      onUpdate: "CASCADE",
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Permissions",
      "fk_permissions_parent"
    )
    await queryInterface.dropTable("Permissions")
  },
}

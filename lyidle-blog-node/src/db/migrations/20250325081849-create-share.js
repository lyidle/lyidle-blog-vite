"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Shares", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Articles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      settingId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Settings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      shareType: {
        type: Sequelize.ENUM("article", "setting"),
        allowNull: false,
        defaultValue: "article",
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

    // 复合索引 - 根据实际查询需求选择添加
    await queryInterface.addIndex("Shares", ["shareType", "articleId"])
    await queryInterface.addIndex("Shares", ["shareType", "settingId"])
  },

  async down(queryInterface, Sequelize) {
    // 然后删除表
    await queryInterface.dropTable("Shares")
  },
}

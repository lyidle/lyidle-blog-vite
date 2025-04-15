"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Filters", {
      word: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: "FilterTypes",
          key: "name",
        },
        onUpdate: "CASCADE", // 分类名更新时自动同步
        onDelete: "RESTRICT", // 防止删除正在使用的分类
      },
    })

    // 3. 可选：添加索引提高查询性能
    await queryInterface.addIndex("Filters", ["type"])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Filters")
  },
}

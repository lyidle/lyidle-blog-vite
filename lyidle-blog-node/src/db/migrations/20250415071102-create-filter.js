"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Filters", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      word: {
        type: Sequelize.STRING,
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
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    })

    // 3. 可选：添加索引提高查询性能
    await queryInterface.addIndex("Filters", ["type"])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Filters")
  },
}

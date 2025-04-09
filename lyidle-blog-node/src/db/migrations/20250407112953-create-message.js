"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Messages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      msgId: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
        comment: "消息ID 自己手动生成",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      senderId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
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
    // 添加联合索引
    await queryInterface.addIndex("Messages", {
      fields: ["senderId", "receiverId"],
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Messages")
  },
}

"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Follows",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        followerId: {
          // 关注者ID
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        followingId: {
          // 被关注者ID
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
      },
      {
        indexes: [
          // 唯一索引防止重复关注
          {
            unique: true,
            fields: ["followerId", "followingId"],
          },
          // 加速查询被关注列表
          {
            fields: ["followerId"],
          },
          // 加速查询粉丝列表
          {
            fields: ["followingId"],
          },
        ],
      }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Follows")
  },
}

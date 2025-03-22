// migrations/YYYYMMDDHHMMSS-create-article-like-dislike.js
"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ArticleLikeDislikes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // 关联用户表
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      targetType: {
        type: Sequelize.ENUM("comment", "article"),
        allowNull: false,
      },
      targetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: true, // 如果 targetType 是 comment，则可以为空
        references: {
          model: "Articles", // 关联文章表
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      likeType: {
        type: Sequelize.ENUM("like", "normal"),
        allowNull: false,
        defaultValue: "normal", // 默认值为 normal
      },
      dislikeType: {
        type: Sequelize.ENUM("dislike", "normal"),
        allowNull: false,
        defaultValue: "normal", // 默认值为 normal
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })

    // 添加联合唯一索引，确保一个用户对同一个目标只能有一条记录
    await queryInterface.addIndex("ArticleLikeDislikes", {
      fields: ["userId", "targetType", "targetId"],
      unique: true,
      name: "unique_user_target",
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ArticleLikeDislikes")
  },
}

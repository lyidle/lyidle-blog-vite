// migrations/YYYYMMDDHHMMSS-create-article-like-dislike.js
"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("LikeDislikes", {
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
        type: Sequelize.ENUM(
          "articleComment",
          "article",
          "settingComment",
          "setting"
        ),
        allowNull: false,
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: true, //可能是文章 也可能是 设置表
        references: {
          model: "Articles", // 关联文章表
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      settingId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Settings", // 关联设置表
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: true, // 如果 targetType 是 article，则可以为空
        references: {
          model: "Comments", // 关联评论表
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

    // 在 up 函数中添加以下索引
    await queryInterface.addIndex("LikeDislikes", ["userId"])
    await queryInterface.addIndex("LikeDislikes", ["targetType"])
    await queryInterface.addIndex("LikeDislikes", ["articleId"])
    await queryInterface.addIndex("LikeDislikes", ["settingId"])
    await queryInterface.addIndex("LikeDislikes", ["commentId"])
    await queryInterface.addIndex("LikeDislikes", ["likeType"])
    await queryInterface.addIndex("LikeDislikes", ["dislikeType"])

    // 复合索引 - 根据实际查询需求选择添加
    await queryInterface.addIndex("LikeDislikes", ["targetType", "articleId"])
    await queryInterface.addIndex("LikeDislikes", ["targetType", "commentId"])
    await queryInterface.addIndex("LikeDislikes", ["targetType", "settingId"])
    await queryInterface.addIndex("LikeDislikes", ["likeType", "dislikeType"])

    // 添加联合唯一索引，确保一个用户对同一个目标只能有一条记录
    await queryInterface.addIndex("LikeDislikes", {
      fields: ["userId", "targetType", "commentId"],
      unique: true,
      name: "unique_user_target",
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("LikeDislikes")
  },
}

// migrations/YYYYMMDDHHMMSS-create-article-like-dislike.js
"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("LikeDislikes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      targetUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "被点赞的用户id",
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      targetType: {
        type: Sequelize.ENUM("comment", "article", "setting"),
        allowNull: false,
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
        allowNull: true,
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

    // 添加联合唯一索引，确保一个用户对同一个目标只能有一条记录
    await queryInterface.addIndex("LikeDislikes", {
      fields: ["userId", "targetType", "commentId"],
      unique: true,
    })
    await queryInterface.addIndex("LikeDislikes", {
      fields: ["userId", "targetType", "articleId"],
      unique: true,
    })
    await queryInterface.addIndex("LikeDislikes", {
      fields: ["userId", "targetType", "settingId"],
      unique: true,
    })

    await queryInterface.addIndex("LikeDislikes", ["userId"]) // 单独索引，常用于查询用户的所有点赞
    await queryInterface.addIndex("LikeDislikes", ["targetUserId"]) // 查询用户收到的点赞

    // 按目标类型+ID的复合索引
    await queryInterface.addIndex("LikeDislikes", ["targetType", "articleId"])
    await queryInterface.addIndex("LikeDislikes", ["targetType", "commentId"])
    await queryInterface.addIndex("LikeDislikes", ["targetType", "settingId"])

    // 对于点赞/点踩类型的查询索引
    await queryInterface.addIndex("LikeDislikes", ["likeType"])
    await queryInterface.addIndex("LikeDislikes", ["dislikeType"])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("LikeDislikes")
  },
}

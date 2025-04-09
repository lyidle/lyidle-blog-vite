"use strict"
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: "评论ID",
      },
      commentId: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
        comment: "评论ID 自己手动生成",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "评论内容",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "发送者的用户id",
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      fromUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "被回复的用户ID",
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "关联文章ID",
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
        comment: "关联设置ID",
        references: {
          model: "Settings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      targetUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "目标内容所有者的用户ID",
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      fromId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "回复的评论ID",
        references: {
          model: "Comments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "顶层评论ID",
        references: {
          model: "Comments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "原文链接",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        comment: "创建时间",
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        comment: "更新时间",
      },
    })

    // 复合索引 - 根据实际查询需求选择添加
    await queryInterface.addIndex("Comments", ["settingId", "fromId"])
    await queryInterface.addIndex("Comments", ["articleId", "fromId"])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Comments")
  },
}

"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // 评论属于用户
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      })

      // 评论属于文章
      this.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
      })

      // 评论属于 设置 关于页面 或其他的 md 格式的文件 页面可能用到评论
      this.belongsTo(models.Setting, {
        foreignKey: "settingId",
        as: "setting",
      })

      // 评论可以有 回复评论（自引用）
      this.belongsTo(models.Comment, {
        foreignKey: "fromId",
        as: "replies",
      })

      // 评论属于父评论（自引用）
      this.belongsTo(models.Comment, {
        foreignKey: "parentId",
        as: "parentComment",
      })

      // 评论的点赞
      this.hasMany(models.LikeDislike, {
        foreignKey: "commentId",
        as: "likes",
      })

      // 一篇 评论 有多个 点赞
      this.hasMany(models.LikeDislike, {
        foreignKey: "commentId",
        as: "commentLikes",
      })
    }
  }
  Comment.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "评论内容",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "发送者的用户id",
      },
      fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "被回复的用户ID",
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "关联文章ID",
      },
      settingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "关联设置ID",
      },
      targetUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "目标内容所有者的用户ID",
      },
      fromId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "回复的评论ID",
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "顶层评论ID",
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "原文链接",
      },
    },
    {
      sequelize,
      modelName: "Comment",
    }
  )
  return Comment
}

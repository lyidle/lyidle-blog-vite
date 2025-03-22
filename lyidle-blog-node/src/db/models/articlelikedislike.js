// models/articlelikedislike.js
"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class ArticleLikeDislike extends Model {
    static associate(models) {
      // 定义与用户表的关联
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      })

      // 定义与文章表的关联
      this.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
      })
    }
  }
  ArticleLikeDislike.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "用户 ID",
      },
      targetType: {
        type: DataTypes.ENUM("comment", "article"),
        allowNull: false,
        comment: "目标类型（comment 或 article）",
      },
      targetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "目标 ID（评论 ID 或文章 ID）",
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: true, // 如果 targetType 是 comment，则可以为空
        comment: "关联的文章 ID",
      },
      likeType: {
        type: DataTypes.ENUM("like", "normal"),
        allowNull: false,
        defaultValue: "normal", // 默认值为 normal
        comment: "点赞类型（like 或 normal）",
      },
      dislikeType: {
        type: DataTypes.ENUM("dislike", "normal"),
        allowNull: false,
        defaultValue: "normal", // 默认值为 normal
        comment: "点踩类型（dislike 或 normal）",
      },
    },
    {
      sequelize,
      modelName: "ArticleLikeDislike",
      comment: "文章或评论的点赞和点踩记录表",
    }
  )
  return ArticleLikeDislike
}

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
      },
      targetType: {
        type: DataTypes.ENUM("comment", "article"),
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false, // 都是对文章的操作
      },
      commentId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true, // 如果 targetType 是 article，则可以为空
      },
      likeType: {
        type: DataTypes.ENUM("like", "normal"),
        allowNull: false,
      },
      dislikeType: {
        type: DataTypes.ENUM("dislike", "normal"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ArticleLikeDislike",
    }
  )
  return ArticleLikeDislike
}

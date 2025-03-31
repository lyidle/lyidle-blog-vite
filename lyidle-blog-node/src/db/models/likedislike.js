// models/LikeDislike.js
"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class LikeDislike extends Model {
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

      // 点赞属于 设置 关于页面 或其他的 md 格式的文件 页面可能用到评论
      this.belongsTo(models.Setting, {
        foreignKey: "settingId",
        as: "setting",
      })
    }
  }
  LikeDislike.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      targetType: {
        type: DataTypes.ENUM("comment", "article", "setting"),
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: true, // 可能是文章 也可能是 设置表
      },
      settingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      commentId: {
        type: DataTypes.INTEGER,
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
      modelName: "LikeDislike",
    }
  )
  return LikeDislike
}

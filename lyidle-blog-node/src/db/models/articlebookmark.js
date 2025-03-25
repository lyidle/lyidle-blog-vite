// models/articlebookmark.js
"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class ArticleBookmark extends Model {
    static associate(models) {
      // 定义关联关系
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      })

      this.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
      })
    }
  }

  ArticleBookmark.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isBookmarked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ArticleBookmark",
    }
  )

  return ArticleBookmark
}

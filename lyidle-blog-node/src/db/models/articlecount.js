"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class ArticleCount extends Model {
    static associate(models) {
      this.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
      })
    }
  }
  ArticleCount.init(
    {
      articleId: DataTypes.INTEGER,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ArticleCount",
    }
  )
  return ArticleCount
}

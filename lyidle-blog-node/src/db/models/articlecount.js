"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class ArticleCount extends Model {
    static associate(models) {}
  }
  ArticleCount.init(
    {
      articleId: DataTypes.INTEGER,
      count: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ArticleCount",
    }
  )
  return ArticleCount
}

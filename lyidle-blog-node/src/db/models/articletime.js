"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class ArticleTime extends Model {
    static associate(models) {}
  }
  ArticleTime.init(
    {
      articleId: DataTypes.INTEGER,
      time: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ArticleTime",
    }
  )
  return ArticleTime
}

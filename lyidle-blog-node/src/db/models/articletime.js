"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class ArticleTime extends Model {
    static associate(models) {
      this.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
      })
    }
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

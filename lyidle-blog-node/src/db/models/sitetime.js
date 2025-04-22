"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class SiteTime extends Model {
    static associate(models) {}
  }
  SiteTime.init(
    {
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SiteTime",
    }
  )
  return SiteTime
}

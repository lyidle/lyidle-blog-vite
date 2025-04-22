"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    static associate(models) {
      // 一篇 设置 有多个 点赞
      this.hasMany(models.LikeDislike, {
        foreignKey: "settingId",
        as: "settingLikes",
      })
    }
  }
  Setting.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      content: DataTypes.JSON,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      link: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Setting",
    }
  )
  return Setting
}

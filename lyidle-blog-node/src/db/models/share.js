"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Share extends Model {
    static associate(models) {
      // 关联文章
      Share.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
        onDelete: "CASCADE",
      })

      // 关联设置
      Share.belongsTo(models.Setting, {
        foreignKey: "settingId",
        as: "setting",
        onDelete: "CASCADE",
      })
    }
  }

  Share.init(
    {
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      settingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      shareType: {
        type: DataTypes.ENUM("article", "setting"),
        allowNull: false,
        defaultValue: "article",
      },
    },
    {
      sequelize,
      modelName: "Share",
    }
  )

  return Share
}

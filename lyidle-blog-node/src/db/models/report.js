"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      // 关联到分类
      this.belongsTo(models.FilterType, {
        foreignKey: "filterType",
        targetKey: "name",
        as: "type",
      })

      // 关联到文章
      this.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
      })

      // 关联到评论
      this.belongsTo(models.Comment, {
        foreignKey: "commentId",
        as: "comment",
      })

      // 关联到消息
      this.belongsTo(models.Message, {
        foreignKey: "msgId",
        as: "message",
      })

      // 关联到用户
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      })
    }
  }
  Report.init(
    {
      desc: DataTypes.STRING,
      filterType: DataTypes.STRING(10),
      targetType: DataTypes.ENUM("article", "comment", "msg", "user"),
      articleId: DataTypes.INTEGER,
      commentId: DataTypes.INTEGER,
      settingId: DataTypes.INTEGER,
      msgId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      targetUserId: DataTypes.INTEGER,
      isSend: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Report",
    }
  )
  return Report
}

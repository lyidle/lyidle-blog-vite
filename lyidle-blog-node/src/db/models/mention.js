"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Mention extends Model {
    static associate(models) {
      // 与被提及用户(User)的关联
      Mention.belongsTo(models.User, {
        foreignKey: "mentionedUserId",
        as: "mentionedUser", // 被提及的用户
      })

      // 与发起提及用户(User)的关联
      Mention.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user", // 发起提及的用户
      })

      // 与评论(Comment)的关联
      Mention.belongsTo(models.Comment, {
        foreignKey: "commentId",
        as: "comment",
      })
    }
  }
  Mention.init(
    {
      commentId: DataTypes.INTEGER,
      mentionedUserId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      link: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Mention",
    }
  )
  return Mention
}

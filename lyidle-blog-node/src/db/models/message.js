"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // 关联发送者
      this.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
      })

      // 关联接收者
      this.belongsTo(models.User, {
        foreignKey: "receiverId",
        as: "receiver",
      })
    }
  }
  Message.init(
    {
      content: DataTypes.TEXT,
      senderId: DataTypes.INTEGER,
      receiverId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Message",
    }
  )
  return Message
}

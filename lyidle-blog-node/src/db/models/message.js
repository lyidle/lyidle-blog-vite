"use strict"
const { Model } = require("sequelize")
const { join } = require("path")
const { existsSync, rm } = require("fs")
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
      // 生成id 标志评论的id，唯一，用于保存消息的的图片
      msgId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Message",
      // 加上 钩子 处理 Message 表的信息
      hooks: {
        afterDestroy: async (message, options) => {
          try {
            // 评论的 图片位置
            const messagePath = join(
              __dirname,
              "../../assets/images",
              `${message.senderId}`,
              "msg",
              `${message.msgId}`
            )
            // 存在 路径 则删除路径
            if (existsSync(messagePath)) {
              rm(messagePath, { recursive: true, force: true }, (err) => {
                if (err) {
                  console.error(
                    `删除消息时删除图片目录出错,senderId:${message.senderId},msgId:${message.msgId}`,
                    err
                  )
                  return
                }
              })
            }
          } catch (error) {
            console.error(
              `删除消息时删除图片目录出错,senderId:${message.senderId},msgId:${message.msgId}`,
              error
            )
          }
        },
      },
    }
  )
  return Message
}

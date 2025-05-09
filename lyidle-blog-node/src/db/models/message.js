"use strict"
const { Model } = require("sequelize")
const { join } = require("path")
const { existsSync, rm } = require("fs")
// 过滤函数
const filterWords = require("../../utils/db/filter")
// 解压的函数
const { decompressStringNotError } = require("../../utils/compression/js")
const { setKey, delKey } = require("../../utils/redis/js")
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
      content: {
        type: DataTypes.TEXT,
        validate: {
          isFilter: async function (value) {
            // 消息 id
            const msgId = this.msgId
            // 是创建  则删除上一次的缓存 目录地址
            const validate = () => !this.id && msgId
            let cacheKey
            if (validate()) {
              cacheKey = `message:imgs:${msgId}`
              // 删除上一次的缓存
              await delKey(cacheKey)
            }
            // 解压
            let content = decompressStringNotError(value || "")
            // 判断有无文本
            if (!content) return
            // 有则判断
            const filters = filterWords.verifyPlus(content)
            if (!filters) return
            // 是创建  则缓存一下 目录地址
            if (validate()) {
              // 需要删除的路径
              const deletePath = join(
                __dirname,
                `../../assets/images/${this.senderId}/msg/${msgId}`
              )
              if (existsSync(deletePath))
                // 缓存未通过的 urls
                setKey(cacheKey, deletePath)
            }
            throw new Error(`消息包含敏感词汇:${filters.join("、")}`)
          },
        },
      },
      senderId: DataTypes.INTEGER,
      receiverId: DataTypes.INTEGER,
      // 生成id 标志评论的id，唯一，用于保存消息的的图片
      msgId: DataTypes.STRING,
      // 是否观看了
      isRead: DataTypes.BOOLEAN,
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

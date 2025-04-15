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
  class Comment extends Model {
    static associate(models) {
      // 评论属于用户
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      })

      // 评论属于文章
      this.belongsTo(models.Article, {
        foreignKey: "articleId",
        as: "article",
      })

      // 评论属于 设置 关于页面 或其他的 md 格式的文件 页面可能用到评论
      this.belongsTo(models.Setting, {
        foreignKey: "settingId",
        as: "setting",
      })

      // 评论可以有 来源评论[回复评论（自引用）]
      this.belongsTo(models.Comment, {
        foreignKey: "fromId",
        as: "fromComment",
      })

      // 评论属于父评论（自引用）
      this.belongsTo(models.Comment, {
        foreignKey: "parentId",
        as: "parentComment",
      })

      // 评论的点赞
      this.hasMany(models.LikeDislike, {
        foreignKey: "commentId",
        as: "likes",
      })

      // 一篇 评论 有多个 点赞
      this.hasMany(models.LikeDislike, {
        foreignKey: "commentId",
        as: "commentLikes",
      })
    }
  }
  Comment.init(
    {
      // 生成id 标志评论的id，唯一，用于保存评论的的图片
      commentId: DataTypes.STRING,
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "评论内容",
        validate: {
          isFilter: async function (value) {
            // 评论 id
            const commentId = this.commentId
            // 是创建  则删除上一次的缓存 目录地址
            const validate = () => !this.id && commentId
            let cacheKey
            if (validate()) {
              cacheKey = `comment:imgs:${commentId}`
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
                `../../assets/images/${this.userId}/comments/${commentId}`
              )
              if (existsSync(deletePath))
                // 缓存未通过的 目录地址
                setKey(cacheKey, deletePath)
            }
            throw new Error(`评论包含敏感词汇:${filters.join("、")}`)
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "发送者的用户id",
      },
      fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "被回复的用户ID",
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "关联文章ID",
      },
      settingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "关联设置ID",
      },
      targetUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "目标内容所有者的用户ID",
      },
      fromId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "回复的评论ID",
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "顶层评论ID",
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "原文链接",
      },
    },
    {
      sequelize,
      modelName: "Comment",
      // 加上 钩子 处理 Comment 表的信息
      hooks: {
        afterDestroy: async (comment, options) => {
          try {
            // 评论的 图片位置
            const commentPath = join(
              __dirname,
              "../../assets/images",
              `${comment.userId}`,
              "comments",
              `${comment.commentId}`
            )
            // 存在 路径 则删除路径
            if (existsSync(commentPath)) {
              rm(commentPath, { recursive: true, force: true }, (err) => {
                if (err) {
                  console.error(
                    `删除评论时删除图片目录出错,userId:${comment.userId},commentId:${comment.commentId}`,
                    err
                  )
                  return
                }
              })
            }
          } catch (error) {
            console.error(
              `删除评论时删除图片目录出错,userId:${comment.userId},commentId:${comment.commentId}`,
              error
            )
          }
        },
      },
    }
  )
  return Comment
}

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
      msgId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      targetUserId: DataTypes.INTEGER,
      isSend: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Report",
      // 加上 钩子 处理 Filter 表的缓存信息
      hooks: {
        // 创建敏感词时的钩子
        beforeCreate: async (filter, options) => {
          // 确保分类存在
          await sequelize.models.FilterType.findOrCreate({
            where: { name: filter.filterType },
            defaults: {
              name: filter.filterType,
              desc: `自动创建的分类: ${filter.filterType}`,
            },
            transaction: options.transaction, // 传递事务保证一致性
          })
        },
      },
    }
  )
  return Report
}

"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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

      // 评论可以有 回复评论（自引用）
      this.belongsTo(models.Comment, {
        foreignKey: "fromId",
        as: "replies",
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
    }
  }
  Comment.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      settingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // 回复 的 那个评论
      fromId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // 最顶层的 id
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Comment",
    }
  )
  return Comment
}

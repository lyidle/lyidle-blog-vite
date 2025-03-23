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

      // 评论可以有多个回复评论（自引用）
      this.hasMany(models.Comment, {
        foreignKey: "fromId",
        as: "replies",
      })

      // 评论的点赞
      this.hasMany(models.ArticleLikeDislike, {
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
        allowNull: false,
      },
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

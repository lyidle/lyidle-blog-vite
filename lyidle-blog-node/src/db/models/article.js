"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 一篇文章属于一个用户
      Article.belongsTo(models.User)
      // 一篇文章属于一个用户信息
      Article.belongsTo(models.UserInfo)
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          notNull: { msg: "文章标题不能为空哦~" },
          notEmpty: { msg: "文章标题不能为空哦~" },
          len: { args: [1, 60], msg: "文章标题长度必须在1-60之间哦~" },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "文章内容不能为空哦~" },
          notEmpty: { msg: "文章内容不能为空哦~" },
        },
      },
      author: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "文章作者不能为空哦~" },
          notEmpty: { msg: "文章作者不能为空哦~" },
          len: { args: [1, 32], msg: "文章作者长度必须在1-32之间哦~" },
        },
      },
      category: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notNull: { msg: "文章分类不能为空哦~" },
          notEmpty: { msg: "文章分类不能为空哦~" },
          len: { args: [1, 10], msg: "文章分类长度必须在1-10之间哦~" },
        },
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "文章标签不能为空哦~" },
          notEmpty: { msg: "文章标签不能为空哦~" },
          set(value) {
            if (!Array.isArray(value))
              throw new Error("文章标签必须是一个数组哦~")
            const result = [...new Set([value].flat(Infinity))]
            this.setDataValue("tags", result)
          },
        },
      },
      carousel: {
        type: DataTypes.TINYINT,
        validate: {
          isTiny(value) {
            if (value !== 0 && value !== 1)
              throw new Error("carousel只能为0和1")
          },
        },
      },
      desc: {
        type: DataTypes.STRING,
        validate: {
          len: { args: [0, 255], msg: "文章描述长度必须在1-255之间哦~" },
        },
      },
      poster: DataTypes.STRING,
      length: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "文章字数不能为空哦~" },
          notEmpty: { msg: "文章字数不能为空哦~" },
          isInt: { msg: "文章字数必须要是个整数哦~" },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "用户id不能为空哦~" },
          notEmpty: { msg: "用户id不能为空哦~" },
          isInt: { msg: "用户id必须要是个整数哦~" },
        },
      },
      userInfoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "用户信息id不能为空哦~" },
          notEmpty: { msg: "用户信息id不能为空哦~" },
          isInt: { msg: "用户信息id必须要是个整数哦~" },
        },
      },
      status: {
        type: DataTypes.TINYINT,
        validate: {
          isTiny(value) {
            if (value !== 0 && value !== 1) throw new Error("status只能为0和1")
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Article",
    }
  )
  return Article
}

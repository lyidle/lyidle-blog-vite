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
      models.Article.belongsTo(models.User)
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "文章标题不能为空哦~" },
          notEmpty: { msg: "文章标题不能为空哦~" },
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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "文章作者不能为空哦~" },
          notEmpty: { msg: "文章作者不能为空哦~" },
        },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "文章分类不能为空哦~" },
          notEmpty: { msg: "文章分类不能为空哦~" },
        },
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "文章标签不能为空哦~" },
          notEmpty: { msg: "文章标签不能为空哦~" },
          async isArray(value) {
            if (!Array.isArray(value)) {
              throw new Error("文章标签必须是一个数组哦~")
            }
          },
        },
      },
      carousel: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isRange(value) {
            if (!(value == "0" || value == 1))
              throw new Error("carousel必须是0或1")
          },
        },
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "文章描述不能为空哦~" },
          notEmpty: { msg: "文章描述不能为空哦~" },
        },
      },
      poster: DataTypes.TEXT,
      length: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "文章字数不能为空哦~" },
          notEmpty: { msg: "文章字数不能为空哦~" },
          isNumber(value) {
            if (!Number.isInteger(Number(value))) {
              throw new Error("文章字数需要是整数~")
            }
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // 设置为非空
        validate: {
          notNull: { msg: "用户id不能为空哦~" },
          notEmpty: { msg: "用户id不能为空哦~" },
        },
      },
      deleteAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Article",
    }
  )
  return Article
}

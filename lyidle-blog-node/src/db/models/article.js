"use strict"
const { Model } = require("sequelize")
// 引入验证
const { accountReg } = require("../../RegExp/loginOrReg/js")
const {
  tagsReg,
  titleReg,
  categoryReg,
  descReg,
} = require("../../RegExp/articleReg")

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      // 一篇文章属于一个用户
      this.belongsTo(models.User, {
        foreignKey: "userId", // 指定外键
      })
      // 一篇文章有 阅读时间记录
      this.hasOne(models.ArticleTime, {
        foreignKey: "articleId",
        as: "time",
      })
      // 一篇文章有 浏览量记录
      this.hasOne(models.ArticleCount, {
        foreignKey: "articleId",
        as: "count",
      })
      // 一篇 文章 有多个 评论
      this.hasMany(models.Comment, { foreignKey: "articleId", as: "comments" })
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
          notNull: { msg: "文章标题不能为空" },
          notEmpty: { msg: "文章标题不能为空" },
          // 正则限制
          is: {
            args: titleReg.reg,
            msg: titleReg.msg,
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "文章内容不能为空" },
          notEmpty: { msg: "文章内容不能为空" },
        },
      },
      author: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "文章作者不能为空" },
          notEmpty: { msg: "文章作者不能为空" },
          // 正则限制
          is: {
            args: accountReg.reg,
            msg: "文章作者长度必须在1-32之间",
          },
        },
      },
      category: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notNull: { msg: "文章分类不能为空" },
          notEmpty: { msg: "文章分类不能为空" },
          // 正则限制
          is: {
            args: categoryReg.reg,
            msg: categoryReg.msg,
          },
        },
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "文章标签不能为空" },
          notEmpty: { msg: "文章标签不能为空" },
          // 自定义验证逻辑
          isArray(value) {
            if (!Array.isArray(value)) {
              throw new Error("文章标签必须是一个数组")
            }
          },
          isNotEmpty(value) {
            if (!value.length) {
              throw new Error("文章标签至少要有一个")
            }
          },
          // 个数
          isLengthValid(value) {
            if (
              value.length < tagsReg.totalMin ||
              value.length > tagsReg.totalMax
            ) {
              throw new Error(tagsReg.msg)
            }
          },
          // 每一项
          isEachItemValid(value) {
            if (value.some((tag) => !tagsReg.itemReg.test(tag))) {
              throw new Error(tagsReg.itemMsg)
            }
          },
        },
        set(value) {
          // 去重存储
          const result = [...new Set([value].flat(Infinity))]
          this.setDataValue("tags", result)
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
          // 正则限制
          is: {
            args: descReg.reg,
            msg: descReg.msg,
          },
        },
      },
      poster: DataTypes.TEXT,
      length: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "文章字数不能为空" },
          notEmpty: { msg: "文章字数不能为空" },
          isInt: { msg: "文章字数必须要是个整数" },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "用户id不能为空" },
          notEmpty: { msg: "用户id不能为空" },
          isInt: { msg: "用户id必须要是个整数" },
        },
      },
      isBin: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Article",
      paranoid: true, // 启用软删除
      deletedAt: "isBin", // 指定软删除字段名称
    }
  )
  return Article
}

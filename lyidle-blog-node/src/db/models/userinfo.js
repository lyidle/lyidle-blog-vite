"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class UserInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 一个用户信息 属于一个用户
      UserInfo.belongsTo(models.User)
      // 一个用户可以有多篇文章
      UserInfo.hasMany(models.Article)
    }
  }
  UserInfo.init(
    {
      pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "文章总数不能为空哦~" },
          notEmpty: { msg: "文章总数不能为空哦~" },
          isInt: { msg: "文章总数必须要是个整数哦~" },
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
      categories: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "文章分类不能为空哦~" },
          notEmpty: { msg: "文章分类不能为空哦~" },
          set(value) {
            if (!Array.isArray(value))
              throw new Error("文章标签必须是一个数组哦~")
            const result = [...new Set([value].flat(Infinity))]
            this.setDataValue("categories", result)
          },
        },
      },
      totalWords: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "总字数不能为空哦~" },
          notEmpty: { msg: "总字数不能为空哦~" },
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
    },
    {
      sequelize,
      timestamps: false,
      modelName: "UserInfo",
    }
  )
  return UserInfo
}

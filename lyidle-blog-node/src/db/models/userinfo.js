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
      models.UserInfo.belongsTo(models.User)
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
        },
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "文章标签不能为空哦~" },
          notEmpty: { msg: "文章标签不能为空哦~" },
          isArray(value) {
            if (!Array.isArray(value)) {
              throw new Error("文章标签必须是一个数组哦~")
            }
          },
        },
      },
      categories: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "文章分类不能为空哦~" },
          notEmpty: { msg: "文章分类不能为空哦~" },
          isArray(value) {
            if (!Array.isArray(value)) {
              throw new Error("文章分类必须是一个数组哦~")
            }
          },
        },
      },
      totalWords: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "总字数不能为空哦~" },
          notEmpty: { msg: "总字数不能为空哦~" },
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
    },
    {
      sequelize,
      timestamps: false,
      modelName: "UserInfo",
    }
  )
  return UserInfo
}

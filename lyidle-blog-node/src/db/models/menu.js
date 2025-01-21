"use strict"
const { Model } = require("sequelize")
// 导入环境变量
require("dotenv").config()
// 引入错误函数
const setError = require("../utils/setError")
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 很多子菜单
      Menu.hasMany(models.MenuList, { as: "children" }) // 指定别名 'children'
    }
  }
  Menu.init(
    {
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "菜单title不能为空哦~" },
          notEmpty: { msg: "菜单title不能为空哦~" },
          len: { arg: [1, 32], msg: "菜单长度必须在1-32之间哦~" },
        },
      },
      icon: {
        type: DataTypes.TEXT,
      },
      titleTo: DataTypes.STRING,
      layout: DataTypes.JSON,
      bannerImg: DataTypes.JSON,
      isBin: {
        type: DataTypes.TINYINT,
        validate: {
          isTiny(value) {
            if (value !== 0 && value !== 1) throw new Error("isBin只能为0和1")
          },
        },
      },
      role: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "角色不能为空哦~" },
          notEmpty: { msg: "角色不能为空哦~" },
        },
        set(value) {
          if (!Array.isArray(value)) throw new setError("角色必须是一个数组哦~")
          const result = [...new Set([value].flat(Infinity))]
          this.setDataValue("role", result)
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Menu",
    }
  )
  return Menu
}

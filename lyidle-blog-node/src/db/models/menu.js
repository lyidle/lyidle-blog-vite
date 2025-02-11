"use strict"
const { Model } = require("sequelize")

// 引入错误函数
const setError = require("../utils/setError")
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      // 递归关联：一个菜单可以有多个子菜单
      Menu.hasMany(models.Menu, { foreignKey: "parentId", as: "children" })
      // 递归关联：一个菜单也可能是某个菜单的子级
      Menu.belongsTo(models.Menu, { foreignKey: "parentId", as: "parent" })
    }
  }

  Menu.init(
    {
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "菜单 title 不能为空" },
          notEmpty: { msg: "菜单 title 不能为空" },
          len: { args: [1, 32], msg: "菜单长度必须在1-32之间" },
          async isUnique(value) {
            const findOne = await sequelize.models.Menu.findOne({
              where: { name: value },
            })
            if (findOne) throw new Error("菜单已存在哦~")
          },
        },
      },
      icon: DataTypes.TEXT,
      to: DataTypes.STRING,
      layout: DataTypes.JSON,
      bannerImg: DataTypes.JSON,
      isBin: DataTypes.DATE,
      role: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "角色不能为空" },
          notEmpty: { msg: "角色不能为空" },
        },
        set(value) {
          if (!Array.isArray(value)) throw new setError("角色必须是一个数组")
          this.setDataValue("role", [...new Set(value.flat(Infinity))])
        },
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true, // 顶级菜单的 parentId 为 null
      },
    },
    {
      sequelize,
      modelName: "Menu",
    }
  )

  return Menu
}

"use strict"
const { Model } = require("sequelize")

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
        },
      },
      icon: DataTypes.TEXT,
      to: DataTypes.STRING,
      layout: DataTypes.JSON,
      bannerImg: DataTypes.JSON,
      isBin: {
        type: DataTypes.TINYINT,
        validate: {
          isTiny(value) {
            if (value !== 0 && value !== 1)
              throw new Error("isBin 只能为 0 和 1")
          },
        },
      },
      role: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "角色不能为空" },
          notEmpty: { msg: "角色不能为空" },
        },
        set(value) {
          if (!Array.isArray(value)) throw new Error("角色必须是一个数组")
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
      timestamps: false,
      modelName: "Menu",
    }
  )

  return Menu
}

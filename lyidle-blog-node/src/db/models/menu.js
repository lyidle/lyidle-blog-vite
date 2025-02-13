"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      // 递归关联：一个菜单可以有多个子菜单
      Menu.hasMany(models.Menu, { foreignKey: "parentId", as: "children" })

      // 递归关联：一个菜单也可能是某个菜单的子级
      Menu.belongsTo(models.Menu, { foreignKey: "parentId", as: "parent" })

      // 关联角色 通过 MenuRole 关联 Role
      Menu.belongsToMany(models.Role, {
        through: "MenuRole", // 指定中间表的名称
        foreignKey: "menuId", // MenuRole 表中的 menuId
        otherKey: "roleId", // MenuRole 表中的 roleId
        as: "role", //别名
      })
    }
  }

  Menu.init(
    {
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
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
      parentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Menu",
      paranoid: true, // 启用软删除
      deletedAt: "isBin", // 指定软删除字段名称
    }
  )

  return Menu
}

"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class MenuList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MenuList.belongsTo(models.Menu, { foreignKey: "MenuId", as: "children" }) // 指定别名 'children'
    }
  }
  MenuList.init(
    {
      menuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "菜单id不能为空哦~" },
          notEmpty: { msg: "菜单id不能为空哦~" },
          isInt: { msg: "菜单id必须要是个整数哦~" },
        },
      },
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "子菜单title不能为空哦~" },
          notEmpty: { msg: "子菜单title不能为空哦~" },
          len: { arg: [1, 32], msg: "菜单长度必须在1-32之间哦~" },
        },
      },
      icon: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "子菜单icon不能为空哦~" },
          notEmpty: { msg: "子菜单icon不能为空哦~" },
          isSvg(value) {
            if (!(value.includes("<svg") && value.includes("</svg>"))) {
              throw new Error("icon必须要是一个svg哦~")
            }
          },
        },
      },
      to: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "子菜单to不能为空哦~" },
          notEmpty: { msg: "子菜单to不能为空哦~" },
        },
      },
      bannerImg: DataTypes.JSON,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "MenuList",
    }
  )
  return MenuList
}

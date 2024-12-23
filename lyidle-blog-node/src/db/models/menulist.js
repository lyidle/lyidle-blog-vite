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
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "子菜单title不能为空哦~" },
          notEmpty: { msg: "子菜单title不能为空哦~" },
        },
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "子菜单icon不能为空哦~" },
          notEmpty: { msg: "子菜单icon不能为空哦~" },
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

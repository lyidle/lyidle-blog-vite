"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Menu.hasMany(models.MenuList)
    }
  }
  Menu.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "菜单title不能为空哦~" },
          notEmpty: { msg: "菜单title不能为空哦~" },
        },
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "菜单icon不能为空哦~" },
          notEmpty: { msg: "菜单icon不能为空哦~" },
        },
      },
      layout: DataTypes.JSON,
      bannerImg: DataTypes.JSON,
      to: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Menu",
    }
  )
  return Menu
}

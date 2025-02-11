"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class MenuRole extends Model {}

  MenuRole.init(
    {
      menuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize, modelName: "MenuRole" }
  )

  return MenuRole
}

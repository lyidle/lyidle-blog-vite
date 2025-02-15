"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      // Permission 通过 中间表 关联 PermissionGroup
      this.belongsToMany(models.PermissionGroup, {
        through: "PermissionGroupPermissions",
      })
    }
  }
  Permission.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      desc: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Permission",
    }
  )
  return Permission
}

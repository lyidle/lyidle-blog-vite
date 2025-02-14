"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class PermissionGroup extends Model {
    static associate(models) {
      // PermissionGroup 通过 对应中间表 关联 Role、Permission
      this.belongsToMany(models.Role, { through: "RolePermissionGroups" })
      this.belongsToMany(models.Permission, {
        through: "PermissionGroupPermissions",
      })
    }
  }
  PermissionGroup.init(
    {
      name: DataTypes.STRING,
      desc: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PermissionGroup",
    }
  )
  return PermissionGroup
}

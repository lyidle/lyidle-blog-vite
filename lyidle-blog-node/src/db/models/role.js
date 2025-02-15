"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Role 通过 对应中间表 关联 User、Menu、PermissionGroup
      this.belongsToMany(models.User, { through: "UserRoles" })
      this.belongsToMany(models.Menu, { through: "MenuRoles" })
      this.belongsToMany(models.PermissionGroup, {
        through: "RolePermissionGroups",
      })
    }
  }
  Role.init(
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
      modelName: "Role",
    }
  )
  return Role
}

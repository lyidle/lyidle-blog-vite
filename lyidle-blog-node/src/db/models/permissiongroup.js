"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class PermissionGroup extends Model {
    static associate(models) {
      // PermissionGroup 通过 对应中间表 关联 Role、Permission
      this.belongsToMany(models.Role, { through: "RolePermissionGroups" })
      this.belongsToMany(models.Permission, {
        through: "PermissionGroupPermissions", // 中间表
        as: "children", // 第一个别名
      })
      this.belongsToMany(models.Permission, {
        through: "PermissionGroupPermissions", // 中间表
        as: "permissions", // 第一个别名
      })
    }
  }
  PermissionGroup.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      desc: DataTypes.STRING,
      isBin: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "PermissionGroup",
      paranoid: true, // 启用软删除
      deletedAt: "isBin", // 指定软删除字段名称
    }
  )
  return PermissionGroup
}

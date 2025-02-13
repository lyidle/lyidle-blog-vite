"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      // 权限与角色是多对多关系
      Permission.belongsToMany(models.Role, {
        through: "RolePermission", // 指定中间表的名称
      })
    }
  }

  Permission.init(
    {
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isBin: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Permission",
      paranoid: true, // 启用软删除
      deletedAt: "isBin", // 指定软删除字段名称
    }
  )

  return Permission
}

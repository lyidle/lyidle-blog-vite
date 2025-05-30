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
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "权限名字不能为空" },
          notEmpty: { msg: "权限名字不能为空" },
          len: { args: [1, 32], msg: "权限名字长度必须在1-32之间" },
        },
      },
      desc: {
        type: DataTypes.STRING,
        validate: {
          len: { args: [0, 255], msg: "权限描述长度必须在0-255之间" },
        },
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

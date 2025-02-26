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
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "角色名字不能为空哦~" },
          notEmpty: { msg: "角色名字不能为空哦~" },
          len: { args: [1, 32], msg: "角色名字长度必须在1-32之间哦~" },
        },
      },
      desc: {
        type: DataTypes.STRING,
        validate: {
          len: { args: [0, 255], msg: "角色描述长度必须在0-255之间哦~" },
        },
      },
      isBin: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Role",
      paranoid: true, // 启用软删除
      deletedAt: "isBin", // 指定软删除字段名称
    }
  )
  return Role
}

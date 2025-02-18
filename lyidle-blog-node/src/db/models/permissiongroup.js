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
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "权限组名字不能为空哦~" },
          notEmpty: { msg: "权限组名字不能为空哦~" },
          len: { args: [1, 32], msg: "权限组名字长度必须在1-32之间哦~" },
          async isUnique(value) {
            const findOne = await sequelize.models.PermissionGroup.findOne({
              where: { name: value },
              paranoid: false,
            })
            if (findOne) throw new Error("权限组名字已存在哦~")
          },
        },
      },
      desc: {
        type: DataTypes.STRING,
        validate: {
          len: { args: [0, 255], msg: "权限组描述长度必须在0-255之间哦~" },
        },
      },
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

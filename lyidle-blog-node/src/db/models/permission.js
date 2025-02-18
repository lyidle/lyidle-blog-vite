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
          notNull: { msg: "权限名字不能为空哦~" },
          notEmpty: { msg: "权限名字不能为空哦~" },
          len: { args: [1, 32], msg: "权限名字长度必须在1-32之间哦~" },
          async isUnique(value) {
            const findOne = await sequelize.models.Permission.findOne({
              where: { name: value },
              paranoid: false,
            })
            if (findOne) throw new Error("权限名字已存在哦~")
          },
        },
      },
      desc: {
        type: DataTypes.STRING,
        validate: {
          len: { args: [0, 255], msg: "权限描述长度必须在0-255之间哦~" },
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

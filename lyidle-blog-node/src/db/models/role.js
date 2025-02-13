"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // 角色与用户是多对多关系
      Role.belongsToMany(models.User, {
        through: "UserRole", // 指定中间表的名称
      })

      // 角色与菜单是多对多关系
      Role.belongsToMany(models.Menu, {
        through: "MenuRole", // 指定中间表的名称
      })
    }
  }

  Role.init(
    {
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
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

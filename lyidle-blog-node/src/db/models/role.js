"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // 角色与用户是多对多关系
      Role.belongsToMany(models.User, {
        through: "UserRole", // 指定中间表的名称
        foreignKey: "roleId", // MenuRole 表中的 roleId
        otherKey: "userId", // MenuRole 表中的 userId
      })

      // 角色与菜单是多对多关系
      Role.belongsToMany(models.Menu, {
        through: "MenuRole", // 指定中间表的名称
        foreignKey: "roleId", // MenuRole 表中的 roleId
        otherKey: "menuId", // MenuRole 表中的 menuId
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
    },
    { sequelize, modelName: "Role" }
  )

  return Role
}

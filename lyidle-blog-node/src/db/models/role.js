"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // 角色与用户是多对多关系
      Role.belongsToMany(models.User, { through: models.UserRole })

      // 角色与菜单是多对多关系
      Role.belongsToMany(models.Menu, { through: models.MenuRole })
    }
  }

  Role.init(
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
    },
    { sequelize, modelName: "Role" }
  )

  return Role
}

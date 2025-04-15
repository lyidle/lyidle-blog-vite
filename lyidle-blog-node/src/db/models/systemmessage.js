"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class SystemMessage extends Model {
    static associate(models) {
      // 关联用户
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      })
    }
  }
  SystemMessage.init(
    {
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "消息标题不能为空",
          },
          len: {
            args: [1, 50],
            msg: "消息标题长度应在1-50个字符之间",
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "消息内容不能为空",
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SystemMessage",
    }
  )
  return SystemMessage
}

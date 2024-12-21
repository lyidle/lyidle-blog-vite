"use strict"
const { Model } = require("sequelize")
const {
  accountReg,
  nickNameReg,
  emailReg,
} = require("@/routes/user/reg/RegExp")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 一个用户可以有多篇文章
      User.hasMany(models.Article)
      // 一个用户有一个用户信息
      User.hasOne(models.UserInfo)
    }
  }
  User.init(
    {
      account: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "账号不能为空哦~" },
          notEmpty: { msg: "账号不能为空哦~" },
          isReg(value) {
            const { reg, msg } = accountReg
            if (!reg.test(value)) {
              throw new Error(msg)
            }
          },
        },
      },
      pwd: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "密码不能为空哦~" },
          notEmpty: { msg: "密码不能为空哦~" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "邮箱不能为空哦~" },
          notEmpty: { msg: "邮箱不能为空哦~" },
          isReg(value) {
            const { reg, msg } = emailReg
            if (!reg.test(value)) {
              throw new Error(msg)
            }
          },
        },
      },
      avater: DataTypes.TEXT,
      signer: DataTypes.STRING,
      role: DataTypes.STRING,
      nickName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "用户名不能为空哦~" },
          notEmpty: { msg: "用户名不能为空哦~" },
          isReg(value) {
            const { reg, msg } = nickNameReg
            if (!reg.test(value)) {
              throw new Error(msg)
            }
          },
        },
      },
      deleteAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  )
  return User
}

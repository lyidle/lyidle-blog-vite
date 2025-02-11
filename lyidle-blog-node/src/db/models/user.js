"use strict"
const { Model } = require("sequelize")
//导入bcryptjs模块 加密
const bcrypt = require("bcryptjs")
// 引入验证
const {
  accountReg,
  nickNameReg,
  pwdReg,
  emailReg,
} = require("../../RegExp/loginOrReg/js")

// 导入环境变量
require("dotenv").config()
// 引入错误函数
const setError = require("../utils/setError")

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 一个用户可以有多篇文章
      User.hasMany(models.Article)

      // 关联角色（多对多）
      User.belongsToMany(models.Role, { through: models.UserRole })
    }
  }

  User.init(
    {
      account: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "账号不能为空哦~" },
          notEmpty: { msg: "账号不能为空哦~" },
          is: {
            args: accountReg.reg,
            msg: accountReg.msg,
          },
          async isUnique(value) {
            const findOne = await sequelize.models.User.findOne({
              where: { account: value },
            })
            if (findOne) throw new Error("用户已存在哦~")
          },
        },
      },
      nickName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "用户名不能为空哦~" },
          notEmpty: { msg: "用户名不能为空哦~" },
          is: {
            args: nickNameReg.reg,
            msg: nickNameReg.msg,
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
        // 使用hash加密
        set(value) {
          if (!pwdReg.reg.test(value)) throw new setError(pwdReg.msg)
          this.setDataValue("pwd", bcrypt.hashSync(value, 10))
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "邮箱不能为空哦~" },
          notEmpty: { msg: "邮箱不能为空哦~" },
          is: {
            args: emailReg.reg,
            msg: emailReg.msg,
          },
          async isUnique(value) {
            const findOne = await sequelize.models.User.findOne({
              where: { email: value },
            })
            if (findOne) throw new Error("邮箱已存在~")
          },
        },
      },
      avatar: DataTypes.TEXT,
      signer: DataTypes.STRING,
      isBin: DataTypes.DATE,
    },
    { sequelize, modelName: "User" }
  )

  return User
}

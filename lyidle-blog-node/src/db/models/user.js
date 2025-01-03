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
} = require("@/routes/user/reg/RegExp")
// 导入环境变量
require("dotenv").config()
// 引入错误函数
const setError = require("../utils/setError")
// 引入普通用户 权限组
const default_user = JSON.parse(process.env.default_user)
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
            if (findOne) {
              throw new Error("邮箱已存在~")
            }
          },
        },
      },
      avatar: DataTypes.TEXT,
      signer: DataTypes.STRING,
      role: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "角色不能为空哦~" },
          notEmpty: { msg: "角色不能为空哦~" },
        },
        set(value) {
          if (!Array.isArray(value)) throw new setError("角色必须是一个数组哦~")
          // 保证至少有个 普通用户组的权限
          const result = [...new Set([value, default_user].flat(Infinity))]
          this.setDataValue("role", result)
        },
      },
      isBin: {
        type: DataTypes.TINYINT,
        validate: {
          isTiny(value) {
            if (value !== 0 && value !== 1) throw new Error("isBin只能为0和1")
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  )
  return User
}

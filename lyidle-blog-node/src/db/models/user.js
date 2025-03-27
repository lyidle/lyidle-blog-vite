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
const setDbError = require("../../utils/error/setDbError/js")

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 一个用户可以有多篇文章
      this.hasMany(models.Article, {
        as: "articles",
      })

      // 关联角色 通过 UserRole 关联 Role
      this.belongsToMany(models.Role, { through: "UserRoles" })

      // User 和 Comment 之间的一对多关系
      this.hasMany(models.Comment, { foreignKey: "userId", as: "comments" })

      // 用户作为关注者 可查关注列表
      User.belongsToMany(models.User, {
        through: "Follow",
        as: "Following",
        foreignKey: "followerId",
        otherKey: "followingId",
      })

      // 用户作为被关注者 可查粉丝列表
      User.belongsToMany(models.User, {
        through: "Follow",
        as: "Followers",
        foreignKey: "followingId",
        otherKey: "followerId",
      })
    }
  }

  User.init(
    {
      account: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "账号不能为空" },
          notEmpty: { msg: "账号不能为空" },
          is: {
            args: accountReg.reg,
            msg: accountReg.msg,
          },
        },
      },
      nickName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "用户名不能为空" },
          notEmpty: { msg: "用户名不能为空" },
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
          notNull: { msg: "密码不能为空" },
          notEmpty: { msg: "密码不能为空" },
        },
        // 使用hash加密
        set(value) {
          if (!pwdReg.reg.test(value)) throw new setDbError(pwdReg.msg)
          this.setDataValue("pwd", bcrypt.hashSync(value, 10))
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "邮箱不能为空" },
          notEmpty: { msg: "邮箱不能为空" },
          is: {
            args: emailReg.reg,
            msg: emailReg.msg,
          },
        },
      },
      avatar: DataTypes.TEXT,
      signer: DataTypes.STRING,
      isBin: DataTypes.DATE,
      userProvince: DataTypes.STRING,
      userAgent: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true, // 启用软删除
      deletedAt: "isBin", // 指定软删除字段名称
    }
  )

  return User
}

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
          async isUnique(value) {
            const findOne = await sequelize.models.User.findOne({
              where: { account: value },
            })
            if (findOne) {
              throw new Error("用户已存在")
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
      avater: DataTypes.TEXT,
      signer: DataTypes.STRING,
      role: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "角色不能为空哦~" },
          notEmpty: { msg: "角色不能为空哦~" },
          async isArray(value) {
            if (!Array.isArray(value)) {
              throw new Error("角色必须是一个数组哦~")
            }
          },
        },
      },
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
      token: DataTypes.STRING(500),
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isTiny(value) {
            if (value !== 0 && value !== 1) throw new Error("status只能为0和1")
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

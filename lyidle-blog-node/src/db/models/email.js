"use strict"
const { Model } = require("sequelize")
// 引入验证
const { emailReg, codeReg } = require("@/routes/user/reg/RegExp")
module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Email.init(
    {
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
        },
      },
      regCode: {
        type: DataTypes.INTEGER(9),
        is: { args: codeReg.reg, msg: codeReg.msg },
      },
      forgetCode: {
        type: DataTypes.INTEGER(9),
        is: { args: codeReg.reg, msg: codeReg.msg },
      },
      regExpiresAt: {
        type: DataTypes.DATE,
        validate: {
          isDate: { msg: "只允许设置日期字符串哦~" },
        },
        get(value) {
          return new Date(value)
        },
      },
      forgetExpiresAt: {
        type: DataTypes.DATE,
        validate: {
          isDate: { msg: "只允许设置日期字符串哦~" },
        },
        get(value) {
          return new Date(value)
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Email",
    }
  )
  return Email
}

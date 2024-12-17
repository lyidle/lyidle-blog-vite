"use strict"
const { Model } = require("sequelize")
const { emailReg, codeReg } = require("@/routes/user/reg/RegExp")
module.exports = (sequelize, DataTypes) => {
  class RegEmail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RegEmail.init(
    {
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
      code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "验证码不能为空哦~" },
          notEmpty: { msg: "验证码不能为空哦~" },
          isReg(value) {
            const { reg, msg } = codeReg
            if (!reg.test(value)) {
              throw new Error(msg)
            }
          },
        },
      },
      expiresAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "RegEmail",
    }
  )
  return RegEmail
}

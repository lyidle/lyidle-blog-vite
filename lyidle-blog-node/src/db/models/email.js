"use strict"
const { Model } = require("sequelize")
const { emailReg } = require("@/routes/user/reg/RegExp")
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
      regCode: DataTypes.INTEGER,
      forgetCode: DataTypes.INTEGER,
      expiresAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Email",
    }
  )
  return Email
}

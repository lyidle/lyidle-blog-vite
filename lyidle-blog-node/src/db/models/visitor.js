"use strict"
const { Model } = require("sequelize")
// 清除缓存
const { setKey, getKey } = require("../../utils/redis/js")
module.exports = (sequelize, DataTypes) => {
  class Visitor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Visitor.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "访客标识不能为空" },
          notEmpty: { msg: "访客标识不能为空" },
        },
      },
    },
    {
      sequelize,
      modelName: "Visitor",
      timestamps: false,
    }
  )
  return Visitor
}

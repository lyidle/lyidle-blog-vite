"use strict"
const { Model } = require("sequelize")
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
        validate: {
          notNull: { msg: "访客标识不能为空哦~" },
          notEmpty: { msg: "访客标识不能为空哦~" },
          async isUnique(value) {
            const find = await Visitor.findOne({ where: { name: value } })
            if (find) throw new Error("访客标识不能重复哦")
          },
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

"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Setting.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          async isUnique(value) {
            const find = await Setting.findOne({ where: { name: value } })
            if (find) throw new Error("设置信息不能重复")
          },
        },
      },
      content: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Setting",
    }
  )
  return Setting
}

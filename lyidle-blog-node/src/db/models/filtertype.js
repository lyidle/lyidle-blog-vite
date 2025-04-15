"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class FilterType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FilterType.init(
    {
      name: {
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: false,
      },
      desc: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "FilterType",
    }
  )
  return FilterType
}

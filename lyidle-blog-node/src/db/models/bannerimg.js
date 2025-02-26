'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bannerImg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bannerImg.init({
    name: DataTypes.STRING,
    dark: DataTypes.STRING,
    light: DataTypes.STRING,
    height: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'bannerImg',
  });
  return bannerImg;
};
"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    static associate(models) {}
  }
  Follow.init(
    {
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER,
      groupName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Follow",
    }
  )
  return Follow
}

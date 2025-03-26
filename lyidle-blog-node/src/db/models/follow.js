"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    static associate(models) {
      // 粉丝
      this.belongsTo(models.User, {
        foreignKey: "followerId",
        as: "follower",
      })
      // 关注
      this.belongsTo(models.User, {
        foreignKey: "followingId",
        as: "following",
      })
    }
  }
  Follow.init(
    {
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Follow",
    }
  )
  return Follow
}

"use strict"
const { Model } = require("sequelize")
// 清除缓存
const { setKey, getKey } = require("@/utils/redis")
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
            // 获取到访客数量
            let touristCounts = +(await getKey("touristCounts"))
            await setKey("touristCounts", touristCounts + 1)
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

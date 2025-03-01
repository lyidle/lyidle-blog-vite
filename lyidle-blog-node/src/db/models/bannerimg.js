"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class BannerImg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BannerImg.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "背景的路径名字不能为空" },
          notEmpty: { msg: "背景的路径名字不能为空" },
          async isMenuExist(value) {
            const findOne = await sequelize.models.Menu.findOne({
              where: { to: value },
              paranoid: false,
            })
            if (!findOne) throw new Error("背景的路径在菜单中不存在")
          },
        },
      },
      dark: DataTypes.STRING,
      light: DataTypes.STRING,
      height: DataTypes.STRING,
      isBin: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "BannerImg",
      paranoid: true, // 启用软删除
      deletedAt: "isBin", // 指定软删除字段名称
    }
  )
  return BannerImg
}

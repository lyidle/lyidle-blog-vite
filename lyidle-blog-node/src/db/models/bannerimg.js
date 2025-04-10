"use strict"
const { Model } = require("sequelize")
// 引入 redis
const { delKey } = require("../../utils/redis/js")
// 删除 缓存
const handlerRedisDel = () => {
  // 删除查询所有 `bannerImg:*` 的缓存
  delKey("bannerImg:*")
  delKey("bannerImg:bin:*")
}
module.exports = (sequelize, DataTypes) => {
  class BannerImg extends Model {
    static associate(models) {}
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
      // 加上 钩子 处理 BannerImg 表的信息
      hooks: {
        // 监听更新操作
        afterUpdate: handlerRedisDel,
        // 监听删除操作
        afterDestroy: handlerRedisDel,
        // 恢复时
        afterRestore: handlerRedisDel,
      },
    }
  )
  return BannerImg
}

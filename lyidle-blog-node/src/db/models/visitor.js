"use strict"
const { Model } = require("sequelize")

// 引入 big.js
const Big = require("big.js")
const { getKey, setKey } = require("../../utils/redis/js")
/**
 * 更新游客数量的回调
 * @param {string} mode 模式
 * @param {1 | -1} sym 符号 加减 乘上 1 或 -1
 */
const updateTotalTourist = async (mode, sym) => {
  // 更新字数
  try {
    let count = await getKey("touristCounts")
    // 使用Big.js处理数字，避免精度问题
    const currentCount = new Big(count || 0)
    const operation = new Big(sym) // sym应该是1或-1
    const updatedCount = currentCount.plus(operation).toString()

    await setKey("touristCounts", updatedCount)
  } catch (error) {
    console.error(`${mode}时，更新用户总数到 Redis 中失败:`, error)
  }
}

module.exports = (sequelize, DataTypes) => {
  class Visitor extends Model {
    static associate(models) {}
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
      // 加上 钩子 处理 User 表的信息
      hooks: {
        // 创建的钩子
        beforeCreate: async (user, options) => {
          // 更新 总个数
          updateTotalTourist("创建", 1)
        },
        // 删除的钩子
        beforeDestroy: async (user, options) => {
          // 检查是否是第一次软删除
          if (user.previous("isBin")) return
          // 更新 总个数
          updateTotalTourist("删除", -1)
        },
        // 恢复时
        beforeRestore: async (user, options) => {
          // 检查是否是第一次恢复（即之前确实被软删除过）
          if (!user.previous("isBin")) return
          // 更新 总个数
          updateTotalTourist("恢复", 1)
        },
      },
    }
  )
  return Visitor
}

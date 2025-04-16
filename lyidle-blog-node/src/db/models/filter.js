"use strict"
const { Model } = require("sequelize")

// 过滤函数
const filterWords = require("../../utils/db/filter")
const { getKey, setKey, delKey } = require("../../utils/redis/js")

// 判断 是否有缓存
const cacheKey = "filters"
module.exports = (sequelize, DataTypes) => {
  class Filter extends Model {
    static associate(models) {}
  }
  Filter.init(
    {
      word: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 分类
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Filter",
      // 加上 钩子 处理 Filter 表的缓存信息
      hooks: {
        // 创建敏感词时的钩子
        beforeCreate: async (filter, options) => {
          // 获取当前缓存
          let filters = await getKey(cacheKey)
          if (!filters) filters = []

          // 获取敏感词
          const word = filter.word

          // 添加到缓存
          filters.push(word)
          await setKey(cacheKey, filters)

          // 添加到 FilterWords 单例
          filterWords.add(word)
        },

        // 更新敏感词时的钩子
        beforeUpdate: async (filter, options) => {
          // 只有 word 字段被修改时才处理
          if (!filter.changed("word")) return

          // 获取旧值和新值
          const oldWord = filter.previous("word")
          const newWord = filter.word
          // 直接删除缓存
          await delKey(cacheKey)

          // 更新 FilterWords 单例
          filterWords.delete(oldWord) // 移除旧词
          filterWords.add(newWord) // 添加新词
        },

        // 删除敏感词时的钩子（仅硬删除时触发）
        beforeDestroy: async (filter, options) => {
          if (!options.force) return // 软删除不处理

          const word = filter.word
          // 直接删除缓存
          await delKey(cacheKey)

          // 从 FilterWords 单例中移除
          filterWords.delete(word)
        },
      },
    }
  )
  return Filter
}

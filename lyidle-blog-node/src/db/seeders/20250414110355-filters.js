"use strict"

// 引入 清除 redids 缓存的 函数
const { clear } = require("../../utils/redis/js")

const fs = require("fs")
const path = require("path")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let sexual = fs.readFileSync(
      path.join(__dirname, "../Sensitive-lexicon-main/Vocabulary/色情词库.txt"),
      "utf8"
    )
    const DataSet = new Set()
    // 色情的 敏感词
    sexual = sexual
      .split("\n")
      .map((word) => {
        if (!word.trim()) return
        // 没有则 添加
        if (DataSet.has(word)) return
        const result = { word, type: "色情" }
        DataSet.add(word)
        return result
      })
      .filter(Boolean)
    DataSet.clear()

    await queryInterface.bulkInsert("Filters", sexual, {})
    // 清空 缓存
    await clear()
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Filters", null, {})
  },
}

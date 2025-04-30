"use strict"

const fs = require("fs")
const path = require("path")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let sexual = fs.readFileSync(
      path.join(__dirname, "../Sensitive-lexicon-main/Vocabulary/色情词库.txt"),
      "utf8"
    )

    const sexualType = "色情"

    // 分类
    let types = [
      "违法违规",
      sexualType,
      "低俗",
      "赌博诈骗",
      "违法信息外链",
      "涉政谣言",
      "虚假不实信息",
      "涉社会事件谣言",
      "人身攻击",
      "侵犯隐私",
      "垃圾广告",
      "引战",
      "刷屏",
      "青少年不良信息",
      "其他",
    ]
    types = types.map((item) => ({
      name: item,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    // 去重的 数组
    const DataSet = new Set()
    // 色情的 敏感词
    sexual = sexual
      .split("\n")
      .map((word) => {
        if (!word.trim()) return
        // 没有则 添加
        if (DataSet.has(word)) return
        const result = {
          word,
          type: sexualType,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        DataSet.add(word)
        return result
      })
      .filter(Boolean)
    DataSet.clear()

    await queryInterface.bulkInsert("FilterTypes", types, {})
    await queryInterface.bulkInsert("Filters", sexual, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Filters", null, {})
    await queryInterface.bulkDelete("FilterTypes", null, {})
  },
}

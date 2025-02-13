"use strict"
const { clear } = require("../../utils/redis/js")
// 引入 模型
const { User } = require("../models")
module.exports = {
  async up(queryInterface, Sequelize) {
    // 获取所有用户的 ID，确保 用户的 关联正确
    const users = await User.findAll({
      attributes: ["id", "account"],
    })

    if (!users.length) {
      throw new Error("Users 表为空，无法插入 Articles")
    }

    // 生成文章数据
    const articleCounts = 100
    const articles = []
    const categories = ["前端", "后端", "科技", "生活", "娱乐", "教育"]
    const tagsList = [
      ["Vue", "JavaScript"],
      ["nodejs", "java", "python"],
      ["Vue", "JavaScript"],
      ["旅行", "美食"],
      ["电影", "音乐"],
      ["学习", "考试"],
    ]

    for (let i = 1; i <= articleCounts; i++) {
      const randomUser = users[Math.floor(Math.random() * 5)]
      const randomCategory = categories[i % categories.length]
      const randomTags = tagsList[i % tagsList.length]

      articles.push({
        title: `文章的title${i}`,
        content: `这是示例文章${i}的内容，包含一些随机文本。`,
        author: randomUser.account,
        category: randomCategory,
        tags: JSON.stringify(randomTags),
        carousel: Math.random() > 0.5 ? 1 : 0,
        desc: `文章的描述内容${i}`,
        // poster: `https://example.com/poster${i}.jpg`,
        length: 20 + i,
        userId: randomUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    // 清空 缓存
    await clear()
    await queryInterface.bulkInsert("Articles", articles, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Articles", null, {})
  },
}

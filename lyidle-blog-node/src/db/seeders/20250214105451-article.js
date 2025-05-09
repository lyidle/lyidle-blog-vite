"use strict"

// 引入 处理好的信息
const { users } = require("../mock/handlerUsers")

// 引入 uuidV4  生成临时文件的 id
const { v4: uuidV4 } = require("uuid")

const fs = require("fs")
const path = require("path")

const content1 = fs.readFileSync(
  path.join(__dirname, "../mock/article.md"),
  "utf8"
)
const content2 = fs.readFileSync(
  path.join(__dirname, "../mock/article2.md"),
  "utf8"
)

module.exports = {
  async up(queryInterface, Sequelize) {
    if (!users.length) {
      throw new Error("Users 表为空，无法插入 Articles")
    }

    // 生成文章数据
    const articleCounts = 2
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

    const contentRender = (i) => {
      let content = `这是示例文章${i}的内容，包含一些随机文本。`
      if (i === 1) content = content1
      if (i === 2) content = content2
      return content
    }
    const lengthRender = (i) => {
      let length = `这是示例文章${i}的内容，包含一些随机文本。`.trim().length
      if (i === 1) length = 6076
      if (i === 2) length = 18523
      return length
    }
    const userIdRender = (i) => {
      // 只随机出 前 5 个 的用户生成数据
      let randomUser = users[Math.floor(Math.random() * 5)] || users[0]
      if (i === 1) randomUser = users[0]
      if (i === 2) randomUser = users[0]
      return randomUser
    }
    let carouselCounts = 0
    for (let i = 1; i <= articleCounts; i++) {
      const randomCategory = categories[i % categories.length]
      const randomTags = tagsList[i % tagsList.length]
      const user = userIdRender(i)
      articles.push({
        title: `文章的title${i}`,
        content: contentRender(i),
        author: user.account,
        category: randomCategory,
        tags: JSON.stringify(randomTags),
        carousel: 1,
        // 成功 次数加一
        // carousel:
        //   Math.random() > 0.5 && carouselCounts <= 8 ? !!++carouselCounts : 0,
        desc: `文章的描述内容${i}`,
        // poster: `https://example.com/poster${i}.jpg`,
        length: lengthRender(i),
        userId: user.id,
        link: `/doc/${i + 1}`,
        articleId: uuidV4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    await queryInterface.bulkInsert("Articles", articles, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Articles", null, {})
  },
}

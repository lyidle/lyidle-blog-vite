"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 文章数组
    const articles = []
    // 用户数组
    const author = []
    // 用户信息数组
    const userInfo = []
    // 循环次数 和 用户的种子对应
    const counts = 50
    // 模拟分类
    const category = ["前端", "后端", "软件", "游戏"]
    // 模拟标签
    const tips = ["html", "css", "js"]
    // 模拟用户
    for (let i = 1; i <= counts; i++) {
      author.push(`test${i}`)
    }
    // 模拟文章数据
    for (let i = 1; i <= counts; i++) {
      const curAuthor = author[Math.floor(Math.random() * author.length)]
      const content = `文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容 ${i}`
      const article = {
        title: `文章的标题 ${i}`,
        content,
        author: curAuthor,
        category: category[Math.floor(Math.random() * category.length)],
        tags: JSON.stringify(tips),
        userId: Number(curAuthor.replace("test", "")),
        carousel: [0, 1][Math.floor(Math.random() * 2)],
        desc: `文章的描述内容文章的描述内容文章的描述内容文章的描述内容${i}`,
        length: content.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      articles.push(article)
      userInfo.push({
        pages: 1,
        tags: JSON.stringify([...new Set(tips)]),
        categories: JSON.stringify([article.category]),
        userId: article.userId,
        totalWords: `${content.length}`,
      })
    }
    await queryInterface.bulkInsert("Articles", articles, {})
    await queryInterface.bulkInsert("UserInfos", userInfo, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Articles", null, {})
    await queryInterface.bulkDelete("UserInfos", null, {})
  },
}

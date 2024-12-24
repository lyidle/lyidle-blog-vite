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
    const category = [
      "前端",
      "后端",
      "软件",
      "游戏",
      "test88888888888888888888",
    ]
    // 模拟标签
    const tags = ["html", "css", "js", "test88888888888888888888"]
    // 模拟用户
    for (let i = 1; i <= counts; i++) {
      author.push(`test${i}`)
    }
    // 模拟描述
    const desc = (i) => {
      if (i === 1 || i === counts)
        return `文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容文章的描述内容${i}`
      else return `文章的描述内容文章的描述内容文章的描述内容文章的描述内容${i}`
    }
    // 模拟title
    const title = (i) => {
      if (i === 1 || i === counts)
        return `文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的title文章的ti${i}`
      else return `文章的title文章的title文章的title文章的title${i}`
    }
    // 模拟文章数据
    for (let i = 1; i <= counts; i++) {
      const curAuthor = author[Math.floor(Math.random() * author.length)]
      const content = `文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容文章的内容 ${i}`
      const article = {
        title: title(i),
        content,
        author: curAuthor,
        category: category[Math.floor(Math.random() * category.length)],
        tags: JSON.stringify([tags[Math.floor(Math.random() * tags.length)]]),
        userId: Number(curAuthor.replace("test", "")),
        carousel: [0, 1][Math.floor(Math.random() * 2)],
        desc: desc(i),
        length: content.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      articles.push(article)
      userInfo.push({
        pages: 1,
        tags: article.tags,
        categories: JSON.stringify(article.category),
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

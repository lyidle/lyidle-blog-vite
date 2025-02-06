const { readFileSync } = require("fs")
const { resolve } = require("path")
const article_md = readFileSync(resolve(__dirname, "../mock/article.md"))
const article2_md = readFileSync(resolve(__dirname, "../mock/article2.md"))

const articleCallback = (
  i,
  content,
  category,
  tags,
  id,
  author = `test${i}`
) => {
  return {
    title: `文章的title${i}`,
    content,
    author: author,
    category: category[Math.floor(Math.random() * category.length)],
    tags: JSON.stringify([tags[Math.floor(Math.random() * tags.length)]]),
    userId: id, // 与 user id 对应
    carousel: [0, 1][Math.floor(Math.random() * 2)],
    desc: `文章的描述${i}`,
    length: content.length,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const articles = []
    const counts = 50 //对应用户数
    const category = ["前端", "后端", "软件", "游戏", "test88888"]
    const tags = ["html", "css", "js", "test8888"]

    // 给每个用户生成一个文章
    for (let i = 1; i <= counts; i++) {
      const content =
        i === 1 ? article_md : i === 2 ? article2_md : `文章的内容${i}`
      const id = i
      articles.push(articleCallback(i, content, category, tags, id))
    }

    // 给 第一个用户生成 多个 标签 和 分类
    const adminCounts = 50
    for (let i = 1; i <= adminCounts; i++) {
      articles.push(
        articleCallback(
          i,
          `文章的内容${i}`,
          [`categories${i}`],
          [`tags${i}`],
          1,
          `test1`
        )
      )
    }

    // 给 第一个用户生成 重复的 标签 和 分类

    for (let i = 1; i <= adminCounts; i++) {
      articles.push(
        articleCallback(
          i,
          `文章的内容${i}`,
          [`categories30`],
          [`tags30`],
          1,
          `test1`
        )
      )
    }

    await queryInterface.bulkInsert("Articles", articles, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Articles", null, {})
  },
}

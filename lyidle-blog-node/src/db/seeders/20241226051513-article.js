"use strict"
/** @type {import('sequelize-cli').Migration} */
const { setKey } = require("../../utils/redis")
module.exports = {
  async up(queryInterface, Sequelize) {
    // 文章数组
    const articles = []
    const counts = 50
    const category = ["前端", "后端", "软件", "游戏", "test88888"]
    const tags = ["html", "css", "js", "test8888"]

    for (let i = 1; i <= counts; i++) {
      const curAuthor = `test${i}`
      const content = `文章的内容${i}`
      const id = i

      const article = {
        title: `文章的title${i}`,
        content,
        author: curAuthor,
        category: category[Math.floor(Math.random() * category.length)],
        tags: JSON.stringify([tags[Math.floor(Math.random() * tags.length)]]),
        userId: id, //与user id 对应
        carousel: [0, 1][Math.floor(Math.random() * 2)],
        desc: `文章的描述${i}`,
        length: content.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      articles.push(article)
    }
    await setKey("webTotalPages", counts)
    await setKey("totalWords", counts * 6)
    await setKey("webUpdatedAt", new Date())
    // 再插入 Articles 表数据
    await queryInterface.bulkInsert("Articles", articles, {})
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Articles", null, {})
  },
}

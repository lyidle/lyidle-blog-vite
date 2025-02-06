import express from "express"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
router.get("/", async (req, res) => {
  // 提取信息
  const { author } = req.query

  // 查询
  const Articles = await Article.findAll({
    where: { author },
    // 只需要 category
    attributes: ["category"],
  })

  // 得到 category
  const categoriesMap = new Map()

  // 循环 去重 category
  Articles.forEach((item: any) => {
    const category = item.dataValues?.category
    let num = categoriesMap.get(category) || 0
    categoriesMap.set(category, ++num)
  })

  // 得到结果
  const categories = Object.fromEntries(categoriesMap)
  categoriesMap.clear()

  // 返回
  res.result(categories, "获取所有categories成功~")
})
export default router

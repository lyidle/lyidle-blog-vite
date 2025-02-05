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
    // 只需要 tags
    attributes: ["tags"],
  })

  // 得到 tags
  const tagsMap = new Set()

  // 循环 去重 tags
  Articles.forEach((item: any) => {
    const tags = item.dataValues?.tags
    tags.forEach((item: string) => {
      tagsMap.add(item)
    })
  })

  // 得到结果
  const tags = Array.from(tagsMap)
  tagsMap.clear()

  // 返回
  res.result(tags, "获取所有tags成功~")
})
export default router

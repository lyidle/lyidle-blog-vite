import express from "express"
// redis
import { getKey, setKey } from "@/utils/redis"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
router.get("/", async (req, res) => {
  // 提取信息
  const { category } = req.query
  if (!category) return res.result(void 0, "获取category下的所有tags失败~")

  // 缓存的键
  const cacheKey = `category:search:allTag:${category}`

  // 判断有无缓存
  const cacheValue = await getKey(cacheKey)
  if (cacheValue) return res.result(cacheValue, "获取category下的所有tags成功~")
  try {
    // 查询
    const Articles = await Article.findAll({
      where: { category },
      // 只需要 category
      attributes: ["tags"],
    })
    if (!Articles?.length)
      return res.result(void 0, "获取category下的所有tags失败~")
    // 得到 category
    const tagsSet = new Set()

    // 循环 去重 category
    Articles.forEach((item: any) => {
      const tag = item.dataValues?.tags
      tag.forEach((_tag: string) => {
        tagsSet.add(_tag)
      })
    })

    // 得到结果
    const tags = Array.from(tagsSet)
    tagsSet.clear()

    // 设置 缓存
    await setKey(cacheKey, tags)
    // 返回
    res.result(tags, "获取category下的所有tags成功~")
  } catch (error) {
    res.result(void 0, "获取category下的所有tags失败~")
  }
})
export default router

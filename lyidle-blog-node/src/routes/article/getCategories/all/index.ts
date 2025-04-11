import express from "express"
// redis
import { getKey, setKey } from "@/utils/redis"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")

const ms = require("ms")
const default_expire = ms(process.env.default_expire)
router.get("/", async (req, res) => {
  // 提取信息
  const { author } = req.query

  // 判断有无缓存
  const cacheValue = await getKey(`allCategories:${author}`)
  if (cacheValue) return res.result(cacheValue, "获取所有categories成功~")
  try {
    // 查询
    const Articles = await Article.findAll({
      where: { author },
      // 只需要 category
      attributes: ["category"],
    })
    if (!Articles?.length) return res.result(void 0, "获取所有categories失败~")
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

    // 设置 缓存
    await setKey(`allCategories:${author}`, categories, default_expire)
    // 返回
    res.result(categories, "获取所有categories成功~")
  } catch (error) {
    res.result(void 0, "获取所有categories失败~")
  }
})
export default router

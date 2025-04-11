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
  const cacheValue = await getKey(`allTags:${author}`)
  if (cacheValue) return res.result(cacheValue, "获取所有tags成功~")
  try {
    // 查询
    const Articles = await Article.findAll({
      where: { author },
      // 只需要 tags
      attributes: ["tags"],
    })

    if (!Articles?.length) return res.result(void 0, "获取所有tags失败~")

    // 得到 tags
    const tagsMap = new Map()

    // 循环 去重 tags
    Articles.forEach((item: any) => {
      const tags = item.dataValues?.tags
      tags.forEach((item: string) => {
        let num = tagsMap.get(item) || 0
        tagsMap.set(item, ++num)
      })
    })

    // 得到结果
    const tags = Object.fromEntries(tagsMap)

    tagsMap.clear()

    // 设置 缓存
    await setKey(`allTags:${author}`, tags, default_expire)
    // 返回
    res.result(tags, "获取所有tags成功~")
  } catch (error) {
    res.result(void 0, "获取所有tags失败~")
  }
})
export default router

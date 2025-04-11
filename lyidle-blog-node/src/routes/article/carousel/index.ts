import express from "express"
// redis
import { getKey, setKey } from "@/utils/redis"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")

const ms = require("ms")
const default_expire = ms(process.env.default_expire)
// 获取轮播图
router.get("/", async (req, res, next) => {
  try {
    const limit = req.query.limit ?? 5

    // 判断有无缓存
    const cacheValue = await getKey(`carousel:${limit}`)
    if (cacheValue) return res.result(cacheValue, "获取首页焦点图成功~")

    const result = await Article.findAll({
      where: { carousel: true },
      attributes: [
        "author",
        "poster",
        "updatedAt",
        "title",
        "desc",
        "category",
        "id",
      ],
      limit: Number(limit),
      order: [
        ["updatedAt", "desc"],
        ["id", "desc"],
      ],
    })

    if (!result?.length) return res.result(void 0, "获取首页焦点图失败~", false)

    // 设置 缓存
    await setKey(`carousel:${limit}`, result, default_expire)
    return res.result(result, "获取首页焦点图成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取首页焦点图失败~", false)
    )
  }
})
export default router

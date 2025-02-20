import express from "express"
// redis
import { getKey, setKey } from "@/utils/redis"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
// 获取最新文章
router.get("/", async (req, res, next) => {
  try {
    const limit = req.query.limit ?? 4
    // 判断有无缓存
    const cacheValue = await getKey(`recentPages:${limit}`)
    if (cacheValue) return res.result(cacheValue, "获取最新文章成功~")

    const result = await Article.findAll({
      attributes: [
        "author",
        "poster",
        "title",
        "createdAt",
        "updatedAt",
        "category",
        "id",
      ],
      limit: Number(limit),
      order: [
        ["updatedAt", "desc"],
        ["id", "desc"],
      ],
    })
    if (!result?.length) return res.result(void 0, "获取最新文章失败~", false)
    // 设置缓存
    await setKey(`recentPages:${limit}`, result)
    return res.result(result, "获取最新文章成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取最新文章失败~", false)
    )
  }
})
export default router

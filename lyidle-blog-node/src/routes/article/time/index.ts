import { getKey, setKey } from "@/utils/redis"
import express from "express"
const { Article, ArticleTime } = require("@/db/models")
const router = express.Router()

/**
 * 创建或更新时间
 */
router.post("/", async (req, res, next) => {
  const { articleId, time } = req.body
  const cacheKey = `article-times:${articleId}`
  // 校验参数
  if (!articleId || !time)
    return res.result(void 0, "articleId 和 time 是必填项", false)

  try {
    // 查找文章
    const article = await Article.findByPk(articleId, { attributes: ["id"] })

    if (!article) return res.result(void 0, "文章未找到", false)

    // 查找或创建 ArticleTime
    const [articleTime, created] = await ArticleTime.findOrCreate({
      where: { articleId },
      defaults: { time },
    })

    // 如果已存在，则更新时间
    if (!created) {
      articleTime.time = time
      await articleTime.save()
    }
    // 更新缓存
    setKey(cacheKey, time)
    return res.result(void 0, "更新文章时间成功")
  } catch (error) {
    return res.result(void 0, "更新文章时间失败", false)
  }
})

/**
 * 查询文章及其时间
 */
router.get("/:id", async (req, res, next) => {
  const { id } = req.params
  const cacheKey = `article-times:${id}`
  const cacheValue = await getKey(cacheKey)
  if (cacheValue)
    // 返回时间
    return res.result(cacheValue, "查询文章时间成功")

  try {
    const article = await Article.findByPk(id, {
      include: [{ model: ArticleTime, attributes: ["time"], as: "time" }],
      attributes: [],
    })

    if (!article) {
      return res.result(void 0, "查询文章失败", false)
    }
    const time = article?.dataValues?.time?.time || 0
    // 更新缓存
    setKey(cacheKey, time)
    // 返回时间
    return res.result(time, "查询文章时间成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询文章时间失败", false)
    )
  }
})

export default router

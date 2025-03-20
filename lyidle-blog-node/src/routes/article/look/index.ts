import { getKey, setKey } from "@/utils/redis"
import express from "express"
const { Article, ArticleCount } = require("@/db/models")
const router = express.Router()

/**
 * 创建或更新浏览量
 */
router.post("/", async (req, res, next) => {
  const { articleId } = req.body
  // 判断 缓存 是否存在 isAccess 是 用户token 或者 游客 token
  const token = req.isAccess
  const cacheKey = `article-look:${token}`
  const cacheValue = await getKey(cacheKey)

  if (cacheValue) return res.result(void 0, "更新文章浏览量成功")

  // 校验参数
  if (!articleId)
    return res.result(void 0, "articleId 和 count 是必填项", false)

  try {
    // 查找文章
    const article = await Article.findByPk(articleId)

    if (!article) return res.result(void 0, "文章未找到", false)

    // 查找或创建 ArticleCount
    const [articleCount, created] = await ArticleCount.findOrCreate({
      where: { articleId },
      defaults: { count: 1 },
    })

    // 如果已存在，则更新浏览量
    if (!created) {
      // 得到 count 自增
      let count = articleCount.count
      articleCount.count = ++count
      await articleCount.save()
    }
    // 设置缓存
    await setKey(cacheKey, true)
    return res.result(void 0, "更新文章浏览量成功")
  } catch (error) {
    return res.result(void 0, "更新文章浏览量失败", false)
  }
})

/**
 * 查询文章及其浏览量
 */
router.get("/:id", async (req, res, next) => {
  const { id } = req.params

  try {
    const article = await Article.findByPk(id, {
      include: [{ model: ArticleCount, attributes: ["count"], as: "count" }],
      attributes: [],
    })

    if (!article) {
      return res.result(void 0, "查询文章失败", false)
    }

    // 返回浏览量
    return res.result(
      article?.dataValues?.count?.count || 0,
      "查询文章浏览量成功"
    )
  } catch (error) {
    return res.result(void 0, "查询文章浏览量失败", false)
  }
})

export default router

import { getKey, setKey } from "@/utils/redis"
import express from "express"
// 引入 big.js
import Big from "big.js"
const { Article, ArticleCount } = require("@/db/models")
const router = express.Router()

const ms = require("ms")
const look_gap_expire = ms(process.env.look_gap_expire)

/**
 * 创建或更新浏览量
 */
router.post("/", async (req, res, next) => {
  const { articleId } = req.body
  // 判断 缓存 是否存在 isAccess 是 用户token 或者 游客 token
  const token = req.isAccess
  const cacheKey = `article-look:${articleId}:${token}`
  const cacheValue = await getKey(cacheKey)

  if (cacheValue) return res.result(void 0, "更新文章浏览量成功")

  // 校验参数
  if (!articleId) return res.result(void 0, "articleId是必填项", false)

  // 获取 数量的 key
  const countsCacheKey = `article-look:${articleId}`
  try {
    // 查找文章
    const article = await Article.findByPk(articleId)

    if (!article) return res.result(void 0, "文章未找到", false)

    // 查找或创建 ArticleCount
    const [articleCount, created] = await ArticleCount.findOrCreate({
      where: { articleId },
      defaults: { count: new Big(1).toString() }, // 使用 Big.js 初始化
    })

    // 如果已存在，则更新浏览量
    if (!created) {
      // 使用 Big.js 进行精确计算
      const currentCount = new Big(articleCount.count)
      const newCount = currentCount.plus(1) // 相当于 count + 1
      articleCount.count = newCount.toString()
      await articleCount.save()
    }
    // 设置缓存
    setKey(cacheKey, true, look_gap_expire)

    // 得到 个数缓存
    let looks = await getKey(countsCacheKey)
    looks = looks ? new Big(looks) : new Big(0)
    looks = looks.plus(1) // 相当于 looks + 1
    // 设置 个数缓存
    setKey(countsCacheKey, looks.toString())
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

  // 获取 数量的 key
  const countsCacheKey = `article-look:${id}`
  // 获取缓存并返回
  const cacheValue = await getKey(countsCacheKey)
  if (!isNaN(+cacheValue))
    // 返回浏览量
    return res.result(cacheValue, "查询文章浏览量成功")

  try {
    const article = await Article.findByPk(id, {
      include: [{ model: ArticleCount, attributes: ["count"], as: "count" }],
      attributes: [],
    })

    if (!article) {
      return res.result(void 0, "查询文章失败", false)
    }

    const counts = article?.dataValues?.count?.count || 0
    // 设置 个数缓存
    await setKey(countsCacheKey, counts)
    // 返回浏览量
    return res.result(counts, "查询文章浏览量成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询文章浏览量失败", false)
    )
  }
})

export default router

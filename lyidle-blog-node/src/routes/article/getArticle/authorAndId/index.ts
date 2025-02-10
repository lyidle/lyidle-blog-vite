import express from "express"
const router = express.Router()
// 导入模型
const { Article } = require("@/db/models")
// 引入 redis
import { getKey, setKey } from "@/utils/redis"
router.get("/", async (req, res, next) => {
  const id = req.query.id
  const author = req.query.author
  if (!id || !author)
    return res.result(void 0, "id、author是必传项哦~", false, 404)
  // 获取缓存 有直接返回
  const result = await getKey(`ArticlefindAuthorAndId:${id}`)
  if (result) return res.result(result, "获取文章成功~")
  try {
    const result = await Article.findOne({
      attributes: { exclude: ["UserId"] },
      where: { isBin: "", id, author },
    })
    if (!result) return res.result(void 0, "没有查找到文章哦~", false, 404)
    if (result.dataValues.isBin)
      return res.result(void 0, "文章被删除了哦~", false, 404)
    // 获取成功时 设置缓存
    await setKey(`ArticlefindAuthorAndId:${id}`, result)
    res.result(result, "获取文章成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取文章失败哦~", false, 404)
    )
  }
})
export default router

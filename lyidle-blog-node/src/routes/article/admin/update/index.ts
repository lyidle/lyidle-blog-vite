import express from "express"
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入 redis 设置缓存
import { setKey, delKey } from "@/utils/redis"

// 引入 模型
const { Article } = require("@/db/models")

const router = express.Router()
router.put(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: articleId } = req.body

      if (!articleId)
        return res.result(void 0, "修改文章时，没有找到文章哦~", false)

      // 查找是否有文章
      const findArticle = await Article.findByPk(articleId)

      // 没有找到文章
      if (!findArticle)
        return res.result(void 0, "修改文章时，没有找到文章哦~", false)

      // 找到提取
      const { userId } = findArticle

      // 判断是否是用户的文章
      if (req.auth.id !== userId) {
        return res.result(void 0, "修改文章时，不能修改他人的文章哦~", false)
      }

      // 提取body 信息
      const { title, content, category, tags, carousel, desc, poster, length } =
        req.body

      // 非空判断
      if (
        !title &&
        !content &&
        !length &&
        !category &&
        !tags &&
        !carousel &&
        !desc &&
        !poster
      )
        return res.result(
          void 0,
          "请至少传入以下信息中的一个title、content、length、category、tags、carousel、desc、poster哦~",
          false
        )

      // 检查并赋值字段
      title && findArticle.set("title", title)
      content && length && findArticle.set("content", content)
      content && length && findArticle.set("length", length)
      category && findArticle.set("category", category)
      tags && findArticle.set("tags", tags)
      carousel && findArticle.set("carousel", carousel)
      desc && findArticle.set("desc", desc)
      poster && findArticle.set("poster", poster)

      // 更新数据
      const result = await findArticle.save()

      // 网站文章最新更新时间 刷新
      await setKey("webUpdatedAt", new Date())
      // 删除总字数统计缓存
      await delKey("webTotalWords")
      // 删除用户信息缓存
      await delKey(`userInfo:${req.auth.id}`)
      // 删除 文章的缓存
      await delKey(`ArticlefindByPk:${result.dataValues.id}`)
      res.result(result, "修改文章成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改文章失败~", false)
      )
    }
  }
)
export default router

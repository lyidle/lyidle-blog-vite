import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
// 引入 redis 设置缓存
import { setKey, getKey, delKey } from "@/utils/redis"
// 引入 重置user的缓存的函数
import { resetUserInfoByArticlePk } from "@/utils/redis/resetUserInfo"
import { resetArticle } from "@/utils/redis/resetArticle"
router.post(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      content,
      category,
      tags,
      desc,
      poster,
      length,
      imgUrls,
      articleId,
    } = req.body

    if (!articleId)
      return res.result(void 0, "增加文章失败,articleId是必传项", false)

    const ArticleData: any = {
      author: req.auth.account,
      userId: req.auth.id,
      title,
      content,
      category,
      tags,
      desc,
      poster,
      length,
      imgUrls: (Array.isArray(imgUrls) && imgUrls) || [],
      articleId,
    }

    try {
      // 创建文章
      const createArticle = await Article.create(ArticleData)
      // 创建成功文章数 +1
      const webTotalPages = await getKey("webTotalPages")
      await setKey("webTotalPages", +webTotalPages + 1)
      // 网站文章最新更新时间 刷新
      await setKey("webUpdatedAt", new Date())

      // 得到 id
      const id = createArticle.dataValues?.id

      // 删除对应用户信息缓存
      await resetUserInfoByArticlePk(id)
      // 删除 对应的用户的文章缓存
      await resetArticle([createArticle])

      // 返回处理后的结果
      return res.result({ id }, "增加文章成功~")
    } catch (err) {
      return res.validateAuth(err, next, () =>
        res.result(void 0, "增加文章失败~", false)
      )
    }
  }
)
export default router

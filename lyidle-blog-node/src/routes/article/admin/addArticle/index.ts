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

router.post(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content, category, tags, desc, poster, length } = req.body

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
    }

    try {
      // 创建文章
      const { dataValues } = await Article.create(ArticleData)
      // 创建成功文章数 +1
      const webTotalPages = await getKey("webTotalPages")
      await setKey("webTotalPages", +webTotalPages + 1)
      // 网站文章最新更新时间 刷新
      await setKey("webUpdatedAt", new Date())
      // 删除总字数统计缓存
      await delKey("webTotalWords")
      // 删除用户信息缓存
      await delKey(`userInfo:${ArticleData.userId}`)
      // 返回处理后的结果
      return res.result({ id: dataValues.id }, "增加文章成功~")
    } catch (err) {
      return res.validateAuth(err, next, () =>
        res.result(err, "增加文章失败~", false)
      )
    }
  }
)
export default router

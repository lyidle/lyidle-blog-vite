import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware } from "@/middleware/auth"
import { publicArticleRemove } from "../delete/remove"
// 引入 模型
const { Article, User, Role } = require("@/db/models")
const router = express.Router()

// 恢复文章
router.put(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    // 得到 用户id 和 文章id
    const userId = req.auth.id
    const articleId = req.body.id
    // 非法判断
    if (!articleId || !userId)
      return res.result(void 0, "恢复文章失败,没有找到文章数据", false)

    try {
      const findArticle = await Article.findByPk(articleId, {
        paranoid: false,
        attributes: { exclude: ["content"] },
        include: [
          {
            model: User,
            paranoid: false,
            attributes: ["id", "account"],
            include: [
              {
                model: Role,
                paranoid: false,
                attributes: ["name"],
              },
            ],
          },
        ],
      })
      if (!findArticle)
        return res.result(void 0, "恢复文章失败,没有找到文章数据", false)

      const article = JSON.parse(JSON.stringify(findArticle))
      if (userId !== article?.userId)
        return res.result(void 0, "恢复文章失败,不能恢复他人的文章", false)

      // 恢复 文章
      await findArticle.restore()
      // 删除缓存
      await publicArticleRemove([findArticle])

      res.result(void 0, "恢复文章成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "恢复文章失败~", false)
      )
    }
  }
)
export default router

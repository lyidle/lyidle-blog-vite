import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware } from "@/middleware/auth"
// 引入 模型
const { Article, User, Role } = require("@/db/models")
const router = express.Router()

// 恢复文章
router.put(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.auth.id
    const articleId = req.body.id
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

      console.log("----------------")
      console.log(findArticle.dataValues)

      // 恢复 文章
      // const newArticle = await findArticle.restore()
      // 删除缓存

      res.result(void 0, "恢复文章成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "恢复文章失败~", false)
      )
    }
  }
)
export default router

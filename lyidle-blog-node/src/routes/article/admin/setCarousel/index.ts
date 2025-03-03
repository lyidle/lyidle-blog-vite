import express from "express"
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { isAdmin, jwtMiddleware } from "@/middleware/auth"
// 引入 redis 设置缓存
import { delKeys, setKey } from "@/utils/redis"
// 引入 清除 user 的缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 清除 article 的缓存的函数
import { resetArticle } from "@/utils/redis/resetArticle"
// 引入 验证 模型中 修改了的 属性字段 的函数
import { validateChangedFields } from "@/utils/db/validateChangedFields"
// 引入 模型
const { Article, User, Role } = require("@/db/models")

const router = express.Router()
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: articleId } = req.body

      if (!articleId)
        return res.result(void 0, "修改文章置顶状态时，没有找到文章", false)

      // 查找是否有文章
      const findArticle = await Article.findByPk(articleId, {
        paranoid: false,
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

      // 没有找到文章
      if (!findArticle)
        return res.result(void 0, "修改文章置顶状态时，没有找到文章", false)

      // 提取body 信息
      const { carousel } = req.body

      // 可能为 null 的字段
      findArticle.set("carousel", +!!carousel)

      // 验证 修改了的 属性字段
      await validateChangedFields(findArticle)

      // 更新数据
      await findArticle.save()

      // 网站文章最新更新时间 刷新
      await setKey("webUpdatedAt", new Date())

      // 得到 user
      const user = JSON.parse(JSON.stringify(findArticle)).User

      // 删除对应用户信息缓存
      await resetUserInfo([user])
      // 删除 对应的用户的文章缓存
      await resetArticle([findArticle], true)

      res.result(void 0, "修改文章置顶状态成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改文章置顶状态失败~", false)
      )
    }
  }
)
export default router

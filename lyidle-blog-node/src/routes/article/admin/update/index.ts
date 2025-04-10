import express from "express"
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入 redis 设置缓存
import { setKey } from "@/utils/redis"
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
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: articleId } = req.body

      if (!articleId)
        return res.result(void 0, "修改文章时，没有找到文章", false)

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
        return res.result(void 0, "修改文章时，没有找到文章", false)

      // 找到提取
      const { userId } = findArticle

      // 判断是否是用户的文章
      if (req.auth.id !== userId) {
        return res.result(void 0, "修改文章时，不能修改他人的文章", false)
      }

      // 提取body 信息
      const {
        title,
        content,
        length,
        category,
        tags,
        desc,
        poster,
        imgUrls,
        articleId: updateArticleId,
      } = req.body

      if (!updateArticleId)
        return res.result(void 0, "增加文章失败,articleId是必传项", false)

      // 非空判断
      if (!title || !content || !length || !category || !tags || !desc)
        return res.result(
          void 0,
          "请至少传入以下信息中的一个title、content、length、category、tags、carousel、desc,是必传项",
          false
        )
      // 检查并赋值字段
      findArticle.set("title", title)
      findArticle.set("content", content)
      findArticle.set("length", length)
      findArticle.set("category", category)
      findArticle.set("tags", (Array.isArray(tags) && tags) || [])
      findArticle.set("imgUrls", (Array.isArray(imgUrls) && imgUrls) || [])
      findArticle.set("articleId", updateArticleId)
      // 可能为 null 的字段
      findArticle.set("desc", desc || null)
      findArticle.set("poster", poster || null)
      // 验证 修改了的 属性字段
      await validateChangedFields(findArticle)

      // 更新数据
      const result = await findArticle.save()

      // 网站文章最新更新时间 刷新
      await setKey("webUpdatedAt", new Date())

      // 得到 user
      const user = JSON.parse(JSON.stringify(findArticle)).User

      // 删除对应用户信息缓存
      await resetUserInfo([user])
      // 删除 对应的用户的文章缓存
      await resetArticle([findArticle])

      res.result(result, "修改文章成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改文章失败~", false)
      )
    }
  }
)
export default router

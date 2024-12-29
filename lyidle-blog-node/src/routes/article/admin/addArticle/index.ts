import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
const router = express.Router()
// 引入模型
const { Article, UserInfo } = require("@/db/models")
router.post(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      author,
      title,
      content,
      category,
      tags,
      carousel,
      desc,
      poster,
      length,
    } = req.body
    const ArticleData: any = {
      author,
      title,
      content,
      category,
      tags,
      carousel: carousel ?? 0,
      desc,
      poster,
      length,
    }
    try {
      // 设置用户id
      const userId = req.auth.id
      ArticleData.userId = userId
      // 查找用户信息
      let findUserInfo = await UserInfo.findOne({
        where: { userId },
      })
      // 没有就创建 用户信息
      if (!findUserInfo) {
        findUserInfo = await UserInfo.create({
          pages: 1,
          tags: [tags],
          categories: [category],
          userId,
          totalWords: Number(length),
        })
      }
      // 有则更新
      if (findUserInfo) {
        const {
          pages,
          tags: findTags,
          categories,
          totalWords,
        } = findUserInfo.dataValues
        findUserInfo = await findUserInfo.update({
          pages: pages + 1,
          tags: [tags, findTags],
          categories: [category, categories],
          totalWords: Number(length) + Number(totalWords),
        })
      }
      // 设置文章的用户信息id
      ArticleData.userInfoId = findUserInfo.dataValues.id
      // 创建文章
      await Article.create(ArticleData)
      return res.result(void 0, "增加文章成功~")
    } catch (err) {
      return res.validateAuth(err, next, () =>
        res.result(err, "增加文章失败~", false)
      )
    }
  }
)
export default router

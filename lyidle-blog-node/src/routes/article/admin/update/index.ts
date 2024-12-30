import express from "express"
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入查找函数
import findArticleFn from "@/routes/article/admin/find"
// 引入error 函数
import myError from "@/utils/Error"
// 引入 redis 设置缓存
const { setKey, delKey } = require("@/utils/redis")
const router = express.Router()
router.put(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 调用查找函数
      const findArticles = await findArticleFn(
        req,
        res,
        ({ commend }: { commend: any }) => {
          commend.attributes = {
            exclude: ["updatedAt", "UserId", "isBin"],
          }
        }
      )

      // 没有找到退出 相应的信息 查找函数中设置了
      if (!findArticles?.id) return
      const { findArticle } = findArticles

      // 判断是否是用户的文章
      if (req.auth.id !== findArticle.userId) {
        next(new myError("PermissionError"))
        return
      }

      // 提取body 信息
      const {
        title,
        content,
        category,
        tags: newArticleTags,
        carousel,
        desc,
        poster,
        length,
      } = req.body

      // 检查并赋值字段
      if (title) findArticle.set("title", title)
      if (content) findArticle.set("content", content)
      if (content && length) findArticle.set("length", length)
      if (category) findArticle.set("category", category)
      if (newArticleTags) findArticle.set("tags", newArticleTags)
      if (carousel) findArticle.set("carousel", carousel)
      if (desc) findArticle.set("desc", desc)
      if (poster) findArticle.set("poster", poster)
      // 更新数据
      const { datValues } = await findArticle.save()
      // 网站文章最新更新时间 刷新
      await setKey("webUpdatedAt", new Date())
      // 删除总字数统计缓存
      await delKey("totalWords")
      // 删除用户信息缓存
      await delKey(`userInfo:${req.auth.id}`)
      res.result(datValues, "修改文章成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改文章失败~", false)
      )
    }
  }
)
export default router

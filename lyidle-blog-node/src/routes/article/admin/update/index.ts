import express from "express"
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入查找函数
import findArticleFn from "@/routes/article/admin/find"
// 引入error 函数
import myError from "@/utils/Error"
// 引入 redis 设置缓存
import { setKey, delKey } from "@/utils/redis"
import { tempImgLinkToPermantLink } from "@/utils/io/compress/tempImgLinkToPermantLink"
import { join, resolve } from "path"
import { unlink } from "fs/promises"
// 用于 获取contentType
const { lookup } = require("mime-types")
// api 的前缀
const api_prefix = process.env.api_prefix || "/api"

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

      const { account } = req.auth

      // 非空判断
      if (
        !(
          title ||
          content ||
          category ||
          newArticleTags ||
          carousel ||
          desc ||
          poster ||
          length
        )
      )
        return res.result(
          void 0,
          "请至少传入以下信息中的一个title、content、category、tags、carousel、desc、poster、length~",
          false
        )

      if (title)
        // 检查并赋值字段
        findArticle.set("title", title)
      if (content) findArticle.set("content", content)
      if (content && length) findArticle.set("length", length)
      if (category) findArticle.set("category", category)
      if (newArticleTags) findArticle.set("tags", newArticleTags)
      if (carousel) findArticle.set("carousel", carousel)
      if (desc) findArticle.set("desc", desc)

      let oldPosterPath = ""
      // 判断是否有poster 和是否是图片
      if (poster && lookup(poster).startsWith("image/")) {
        // 生成的文件 的路径
        const outputRelative = join(
          __dirname,
          `../../../../assets/images/${account}/md/poster`
        )

        // 静态文件路径
        const staticPath = resolve(__dirname, "../../../../")
        try {
          // 处理 临时图片 转为 永久
          const { successImg } = await tempImgLinkToPermantLink(
            [poster],
            outputRelative,
            staticPath
          )
          const newPoster = successImg[0]?.url
          const originPoster = findArticle.dataValues?.poster

          // 旧的不等于新的
          if (originPoster !== newPoster) {
            // 处理 完poster后 保存旧的地址 用于删除
            oldPosterPath = join(
              staticPath,
              originPoster.replace(api_prefix.replace(/\//, "\\"), "")
            )
            findArticle.set("poster", newPoster)
          }
        } catch (error) {
          console.warn("文章的poster处理错误~", error)
        }
      }

      // 更新数据
      const result = await findArticle.save()
      // 判断是否删除 旧的 poster
      if (oldPosterPath) {
        try {
          await unlink(oldPosterPath)
        } catch (error) {
          console.warn("文章的旧的poster删除失败~", oldPosterPath, error)
        }
      }
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

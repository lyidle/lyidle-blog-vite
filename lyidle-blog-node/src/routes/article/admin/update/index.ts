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

// 引入 模型
const { Article } = require("@/db/models")

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
      const { id: articleId } = req.body

      // 初始命令
      const commend: any = {}

      if (!articleId)
        return res.result(void 0, "删除文章时，没有找到文章哦~", false)

      // 按照id 查询
      commend.where = {
        id: articleId,
        attributes: {
          exclude: ["updatedAt", "UserId", "isBin"],
        },
      }

      // 查找是否有文章
      const findArticle = await Article.findOne(commend)

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

      // 提取 jwt 信息
      const { account } = req.auth

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

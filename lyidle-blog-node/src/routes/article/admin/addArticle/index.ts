import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入 把临时图片转为永久图片的 函数 文章专用
import { mdContentIm } from "@/utils/io/compress/mdContentImg"
import { join, relative, resolve } from "path"
// 解压文件 和 压缩文件 存储替换链接为永久的
import {
  compressString,
  decompressString,
} from "@/utils/io/compress/compressAndDecompress"
const router = express.Router()
// 引入模型
const { Article } = require("@/db/models")
// 引入 redis 设置缓存
import { setKey, getKey, delKey } from "@/utils/redis"
router.post(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      content,
      category,
      tags,
      carousel,
      desc,
      poster,
      length,
      tempImg,
    } = req.body
    const ArticleData: any = {
      author: req.auth.account,
      title,
      content,
      category,
      tags,
      carousel: carousel ?? 0,
      desc,
      poster,
      length,
      userId: req.auth.id,
    }
    const { account } = req.auth
    try {
      // 生成的文件 的路径
      const outputRelative = join(
        __dirname,
        `../../../../assets/images/${account}/md/content`
      )

      // 静态文件路径
      const staticPath = resolve(__dirname, "../../../../")
      // 处理 临时图片 转为 永久
      const result = await mdContentIm(
        tempImg,
        outputRelative,
        staticPath,
        account
      )

      const { successImg } = result

      // 替换链接
      if (successImg.length && Array.isArray(successImg)) {
        // 用于生成正则 替换用
        let origins = successImg
          .map((item) => item.origin.replace(/\\/g, "\\\\"))
          .join("|")
        const reg = new RegExp(origins, "g")
        // 解压缩内容
        const md = decompressString(content) as string
        // 替换文本
        const result = md.replace(reg, (matched) => {
          const item = successImg.find((img) => img.origin === matched)
          if (item) {
            // 确保 URL 中的路径分隔符为正斜杠
            let url = item.url.replace(/\\/g, "/")
            return url
          }
          return matched // 如果没有找到匹配的项，则返回原匹配字符串（或根据需要处理）
        })
        // 把结果压缩后保存到数据库
        ArticleData.content = compressString(result)
      }

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
      return res.result({ ...result, id: dataValues.id }, "增加文章成功~")
    } catch (err) {
      return res.validateAuth(err, next, () =>
        res.result(err, "增加文章失败~", false)
      )
    }
  }
)
export default router

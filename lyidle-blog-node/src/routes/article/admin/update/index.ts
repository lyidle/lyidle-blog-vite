import express from "express"
// 引入类型
import type { FindOptions } from "sequelize"
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入查找函数
import findArticleFn from "@/routes/article/admin/find"

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
        ({ commend }: { commend: FindOptions }) => {
          commend.attributes = {
            exclude: ["updatedAt", "UserId", "userId"],
          }
        }
      )
      if (!findArticles?.id) return
      // 找到提取
      const { findArticle, id } = findArticles
      // 提取body 信息
      const {
        title,
        content,
        category,
        tags,
        carousel,
        desc,
        poster,
        length,
        oldLength,
        status,
      } = req.body

      // article 更新的数据
      const result: any = {}

      // 内容和长度信息都没有 返回修改失败
      if (!(content && length))
        return res.result(void 0, "必须要有内容~", false)

      // 检查并赋值字段
      if (title) result.title = title
      if (content) result.content = content
      if (content && length) result.length = length
      if (category) result.category = category
      if (tags) result.tags = tags
      result.carousel = carousel ?? 0
      if (desc) result.desc = desc
      if (poster) result.poster = poster
      result.status = status ?? findArticle.dataValues.status

      // 更新数据
      const returnData = await findArticle.update(result)

      // // 找到对应信息 更新
      // const findUserInfo = await UserInfo.findByPk(userId)
      // // 更新的数据
      // const updateData: any = {}
      // // 总字数的变化
      // // 计算差值用于更新对应的用户数据
      // const lengthGap = Math.abs(oldLength - length) // 差值计算，无论增加或减少
      // // 得到总字数 与 tags
      // const { totalWords } = findUserInfo.dataValues
      // // 计算增加还是减少
      // const newTotalWords =
      //   oldLength > length ? totalWords - lengthGap : totalWords + lengthGap
      // // 新的总字数
      // updateData.totalWords = newTotalWords
      // // 判断article还有无旧的tags，来进行增删

      // // updateData.tags = tags
      // // 更新用户数据
      // findUserInfo.update(updateData, { where: { id } })

      res.result({ ...returnData.dataValues }, "修改文章成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改文章失败~", false)
      )
    }
  }
)
export default router

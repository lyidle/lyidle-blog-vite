import express from "express"
import { FindOptions } from "sequelize"
// 引入查找函数
import findArticleFn from "@/routes/article/admin/find"
const router = express.Router()
router.put("/", async (req, res, next) => {
  try {
    // 调用查找函数
    const findArticles = await findArticleFn(
      req,
      res,
      ({ commend }: { commend: FindOptions }) => {
        commend.attributes = {
          exclude: ["deleteAt", "updatedAt", "UserId", "userId"],
        }
      }
    )
    if (!findArticles?.id) return
    // 找到提取
    const { findArticle } = findArticles
    // 提取body 信息
    const { title, content, category, tags, carousel, desc, poster, length } =
      req.body
    const result: any = {}

    // 检查并赋值字段
    if (title) result.title = title
    if (content) result.content = content
    if (content && length) result.length = length
    if (category) result.category = category
    if (tags) result.tags = Array.isArray(tags) ? tags : [tags] // 确保 tags 是数组
    if (carousel)
      result.carousel = Array.isArray(carousel) ? carousel : [carousel] // 确保 carousel 是数组
    if (desc) result.desc = desc
    if (poster) result.poster = poster
    // 更新数据
    const returnData = await findArticle.update(result)
    res.result({ ...returnData.dataValues }, "修改文章成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "修改文章失败~", false)
    )
  }
})
export default router

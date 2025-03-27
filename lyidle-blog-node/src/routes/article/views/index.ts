import express from "express"
const router = express.Router()

// 导入模型
const { Article, ArticleCount, sequelize } = require("@/db/models")

router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params

    const findArticle = await Article.findAll({
      where: {
        userId,
        isBin: null, // 排除已删除的文章
      },
      include: [
        {
          model: ArticleCount,
          as: "count",
          attributes: [],
        },
      ],
      attributes: [
        "id",
        [sequelize.col("count.count"), "count"], // 直接获取浏览量
      ],
      raw: true, // 返回原始数据，提高性能
    })

    const totalcount = findArticle.reduce(
      (sum: any, article: any) => sum + (article.count || 0),
      0
    )

    res.result(totalcount, "获取文章浏览量成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取文章浏览量失败", false)
    )
  }
})
export default router

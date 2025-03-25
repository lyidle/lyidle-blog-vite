import express from "express"
// 引入模型
const { ArticleBookmark } = require("@/db/models")

const router = express.Router()

// 获取文章的收藏数量
router.get("/:articleId", async (req, res, next) => {
  const { articleId } = req.params

  // 非空判断
  if (!articleId) return res.result(void 0, "articleId 是必传项", false)

  try {
    // 查询收藏数量
    const { count, rows } = await ArticleBookmark.findAndCountAll({
      where: {
        articleId,
        isBookmarked: true, // 只统计有效收藏记录
      },
    })

    // 返回结果
    res.result(
      {
        count,
        userIds: rows.map((item: any) => item.userId),
      },
      "获取收藏数量成功"
    )
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取收藏数量失败", false)
    )
  }
})

export default router

import express from "express"
// 引入 点赞 详情的 接口
import details from "./details"

const { sequelize } = require("@/db/models")

const router = express.Router()

// 获取用户的点赞信息（按文章、设置、评论分别查询）
router.get("/", async (req, res, next) => {
  const targetUserId = req.auth.id
  const { query } = req

  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize

  try {
    const [articles, settings, comments] = await Promise.all([
      // 查询文章及其点赞信息
      sequelize.query(
        `
        SELECT 
          a.id AS articleId, 
          a.title, 
          a.updatedAt,
          COUNT(DISTINCT ld.userId) AS likeCount,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', u.id,
                'account', u.account,
                'nickName', u.nickName,
                'avatar', u.avatar
              )
            )
            FROM (
              SELECT DISTINCT ld.userId, MAX(ld.updatedAt) AS updatedAt
              FROM LikeDislikes ld
              WHERE ld.articleId = a.id
                AND ld.targetUserId = :targetUserId
                AND ld.likeType = 'like'
                AND ld.userId != :targetUserId
              GROUP BY ld.userId
              ORDER BY updatedAt DESC, ld.userId DESC
              LIMIT 2
            ) AS recent
            JOIN Users u ON u.id = recent.userId
          ) AS recentLikers,
          MAX(ld.updatedAt) AS lastLikeAt
        FROM Articles a
        JOIN LikeDislikes ld ON ld.articleId = a.id
          AND ld.targetUserId = :targetUserId
          AND ld.likeType = 'like'
          AND ld.userId != :targetUserId
        GROUP BY a.id
        ORDER BY a.updatedAt DESC, a.id DESC
        LIMIT :limit OFFSET :offset
      `,
        {
          replacements: { targetUserId, limit: pageSize, offset },
          type: sequelize.QueryTypes.SELECT,
        }
      ),

      // 查询设置及其点赞信息
      sequelize.query(
        `
        SELECT 
          s.id AS settingId, 
          s.name, 
          s.updatedAt,
          COUNT(DISTINCT ld.userId) AS likeCount,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', u.id,
                'account', u.account,
                'nickName', u.nickName,
                'avatar', u.avatar
              )
            )
            FROM (
              SELECT DISTINCT ld.userId, MAX(ld.updatedAt) AS updatedAt
              FROM LikeDislikes ld
              WHERE ld.settingId = s.id
                AND ld.targetUserId = :targetUserId
                AND ld.likeType = 'like'
                AND ld.userId != :targetUserId
              GROUP BY ld.userId
              ORDER BY updatedAt DESC, ld.userId DESC
              LIMIT 2
            ) AS recent
            JOIN Users u ON u.id = recent.userId
          ) AS recentLikers,
          MAX(ld.updatedAt) AS lastLikeAt
        FROM Settings s
        JOIN LikeDislikes ld ON ld.settingId = s.id
          AND ld.targetUserId = :targetUserId
          AND ld.likeType = 'like'
          AND ld.userId != :targetUserId
        GROUP BY s.id
        ORDER BY s.updatedAt DESC, s.id DESC
        LIMIT :limit OFFSET :offset
      `,
        {
          replacements: { targetUserId, limit: pageSize, offset },
          type: sequelize.QueryTypes.SELECT,
        }
      ),

      // 查询评论及其点赞信息
      sequelize.query(
        `
        SELECT 
          c.id AS commentId, 
          c.content, 
          c.updatedAt,
          c.link,
          COUNT(DISTINCT ld.userId) AS likeCount,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', u.id,
                'account', u.account,
                'nickName', u.nickName,
                'avatar', u.avatar
              )
            )
            FROM (
              SELECT DISTINCT ld.userId, MAX(ld.updatedAt) AS updatedAt
              FROM LikeDislikes ld
              WHERE ld.commentId = c.id
                AND ld.targetUserId = :targetUserId
                AND ld.likeType = 'like'
                AND ld.userId != :targetUserId
              GROUP BY ld.userId
              ORDER BY updatedAt DESC, ld.userId DESC
              LIMIT 2
            ) AS recent
            JOIN Users u ON u.id = recent.userId
          ) AS recentLikers,
          MAX(ld.updatedAt) AS lastLikeAt
        FROM Comments c
        JOIN LikeDislikes ld ON ld.commentId = c.id
          AND ld.targetUserId = :targetUserId
          AND ld.likeType = 'like'
          AND ld.userId != :targetUserId
        GROUP BY c.id
        ORDER BY c.updatedAt DESC, c.id DESC
        LIMIT :limit OFFSET :offset
      `,
        {
          replacements: { targetUserId, limit: pageSize, offset },
          type: sequelize.QueryTypes.SELECT,
        }
      ),
    ])

    // 构造返回结果
    const result = {
      pagination: {
        total: articles.length + settings.length + comments.length,
        currentPage,
        pageSize,
        articleCount: articles.length,
        settingCount: settings.length,
        commentCount: comments.length,
      },
      items: [
        ...articles.map((item: any) => ({
          ...item,
          type: "article",
        })),
        ...settings.map((item: any) => ({
          ...item,
          type: "setting",
        })),
        ...comments.map((item: any) => ({
          ...item,
          type: "comment",
        })),
        // @ts-ignore
      ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    }

    res.result(result, "获取用户点赞信息成功")
  } catch (error) {
    console.error(error)
    res.result(void 0, "获取用户点赞信息失败", false)
  }
})

router.use("/details", details)
export default router

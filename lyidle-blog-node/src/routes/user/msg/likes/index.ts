import express from "express"
// 引入 点赞 详情的 接口
import details from "./details"

const { sequelize } = require("@/db/models")

const router = express.Router()

// 获取用户的点赞信息（按文章、设置、评论分别查询）
router.get("/", async (req, res, next) => {
  const targetUserId = req.auth.id
  const { query } = req

  try {
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    // 先查询总数
    const [articleCount, settingCount, commentCount] = await Promise.all([
      sequelize
        .query(
          `SELECT COUNT(DISTINCT a.id) AS count 
         FROM Articles a
         JOIN LikeDislikes ld ON ld.articleId = a.id
           AND ld.targetUserId = :targetUserId
           AND ld.likeType = 'like'
           AND ld.userId != :targetUserId`,
          {
            replacements: { targetUserId },
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        )
        .then((res) => res?.count || 0),

      sequelize
        .query(
          `SELECT COUNT(DISTINCT s.id) AS count 
         FROM Settings s
         JOIN LikeDislikes ld ON ld.settingId = s.id
           AND ld.targetUserId = :targetUserId
           AND ld.likeType = 'like'
           AND ld.userId != :targetUserId`,
          {
            replacements: { targetUserId },
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        )
        .then((res) => res?.count || 0),

      sequelize
        .query(
          `SELECT COUNT(DISTINCT c.id) AS count 
         FROM Comments c
         JOIN LikeDislikes ld ON ld.commentId = c.id
           AND ld.targetUserId = :targetUserId
           AND ld.likeType = 'like'
           AND ld.userId != :targetUserId`,
          {
            replacements: { targetUserId },
            type: sequelize.QueryTypes.SELECT,
            plain: true,
          }
        )
        .then((res) => res?.count || 0),
    ])

    // 查询具体数据
    const [articles, settings, comments] = await Promise.all([
      // 查询文章及其点赞信息
      sequelize.query(
        `
        SELECT 
          a.id AS articleId, 
          a.title, 
          a.updatedAt,
          a.link,
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
          s.link,
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
        total: articleCount + settingCount + commentCount, // 使用准确的总数
        currentPage,
        pageSize,
        articleCount,
        settingCount,
        commentCount,
      },
      items: [
        ...articles.map((item) => ({
          ...item,
          type: "article",
        })),
        ...settings.map((item) => ({
          ...item,
          type: "setting",
        })),
        ...comments.map((item) => ({
          ...item,
          type: "comment",
        })),
      ].sort(
        (a, b) =>
          (new Date(b.updatedAt) as any) - (new Date(a.updatedAt) as any)
      ),
    }

    res.result(result, "获取用户点赞信息成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取用户点赞信息失败", false)
    )
  }
})

router.use("/details", details)
export default router

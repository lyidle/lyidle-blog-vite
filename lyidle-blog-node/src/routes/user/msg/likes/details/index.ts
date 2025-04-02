import express from "express"
import { Op } from "sequelize"
const {
  LikeDislike,
  User,
  Article,
  Setting,
  Comment,
  sequelize,
} = require("@/db/models")

const router = express.Router()

router.get("/", async (req, res, next) => {
  const targetUserId = req.auth.id
  const { query } = req

  // 分页参数处理
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize

  // 验证查询参数
  const { articleId, settingId, commentId } = query
  const idCount = [articleId, settingId, commentId].filter(Boolean).length

  if (idCount > 1) {
    return res.result(void 0, "只能指定一种ID类型进行查询", false)
  }

  if (idCount === 0) {
    return res.result(
      void 0,
      "必须指定articleId、settingId或commentId中的一个",
      false
    )
  }

  // 确定目标类型和ID
  let targetType: string | null = null
  let targetId: string | null = null
  let targetModel: any
  let targetAttributes: string[] = []
  let targetField: string = ""

  if (articleId) {
    targetType = "article"
    targetId = articleId as string
    targetModel = Article
    targetField = "articleId"
    targetAttributes = ["id", "title", "content"]
  } else if (settingId) {
    targetType = "setting"
    targetId = settingId as string
    targetModel = Setting
    targetField = "settingId"
    targetAttributes = ["id", "name", "content", "link"]
  } else if (commentId) {
    targetType = "comment"
    targetId = commentId as string
    targetModel = Comment
    targetField = "commentId"
    targetAttributes = ["id", "content", "link"]
  }

  // 非法判断
  if (targetId === null || targetType === null)
    return res.result(void 0, "目标对象不存在", false)

  try {
    // 查询目标对象
    let findtargetModel = await targetModel.findOne({
      where: { id: targetId },
      attributes: targetAttributes,
    })

    if (!findtargetModel) {
      return res.result(void 0, "目标对象不存在", false)
    }
    findtargetModel = JSON.parse(JSON.stringify(findtargetModel))

    // 使用原始SQL查询实现按用户分页和去重
    const queryStr = `
      SELECT 
        u.id, 
        u.account, 
        u.nickName, 
        u.avatar,
        MAX(ld.updatedAt) AS lastLikeAt,
        COUNT(ld.id) AS likeCount
      FROM Users u
      JOIN LikeDislikes ld ON ld.userId = u.id
      WHERE ld.${targetField} = :targetId
        AND ld.targetUserId = :targetUserId
        AND ld.likeType = 'like'
        AND ld.userId != :targetUserId
      GROUP BY u.id
      ORDER BY lastLikeAt DESC, u.id DESC
      LIMIT :limit OFFSET :offset
    `

    const countQueryStr = `
      SELECT COUNT(DISTINCT userId) AS total
      FROM LikeDislikes
      WHERE ${targetField} = :targetId
        AND targetUserId = :targetUserId
        AND likeType = 'like'
        AND userId != :targetUserId
    `

    // 执行查询
    const [users, countResult] = await Promise.all([
      sequelize.query(queryStr, {
        replacements: {
          targetId,
          targetUserId,
          limit: pageSize,
          offset,
        },
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(countQueryStr, {
        replacements: {
          targetId,
          targetUserId,
        },
        type: sequelize.QueryTypes.SELECT,
      }),
    ])

    const total = countResult[0]?.total || 0

    // 构造返回结果
    const result = {
      pagination: {
        total,
        currentPage,
        pageSize,
      },
      target: {
        id: findtargetModel.id,
        ...findtargetModel,
        type: targetType,
      },
      likes: users.map((user: any) => ({
        user: {
          id: user.id,
          account: user.account,
          nickName: user.nickName,
          avatar: user.avatar,
        },
        lastLikeAt: user.lastLikeAt,
        likeCount: user.likeCount,
      })),
    }

    res.result(result, "获取点赞详情成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取点赞详情失败", false)
    )
  }
})

export default router

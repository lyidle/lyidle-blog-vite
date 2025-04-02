import express from "express"
import { Op } from "sequelize"
const { LikeDislike, User, Article, Setting, Comment } = require("@/db/models")

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

  // 构建基础查询条件
  const whereCondition: any = {
    targetUserId,
    likeType: "like",
    userId: { [Op.ne]: targetUserId },
  }

  // 确定目标类型和关联模型
  let targetType: string
  let includeModels: any = [
    {
      model: User,
      as: "user",
      attributes: ["id", "account", "nickName", "avatar"],
    },
  ]

  if (articleId) {
    whereCondition.articleId = articleId
    targetType = "article"
    includeModels.push({
      model: Article,
      as: "article",
      attributes: ["id", "title"],
    })
  }
  if (settingId) {
    whereCondition.settingId = settingId
    targetType = "setting"
    includeModels.push({
      model: Setting,
      as: "setting",
      attributes: ["id", "name"],
    })
  }
  if (commentId) {
    whereCondition.commentId = commentId
    targetType = "comment"
    includeModels.push({
      model: Comment,
      as: "comment",
      attributes: ["id", "content"],
    })
  }

  try {
    // 查询点赞记录
    const { count, rows } = await LikeDislike.findAndCountAll({
      where: whereCondition,
      include: includeModels,
      order: [
        ["updatedAt", "desc"],
        ["id", "desc"],
      ],
      limit: pageSize,
      offset,
      distinct: true,
    })

    // 格式化返回数据
    const formattedLikes = rows.map((like: any) => {
      const baseItem = {
        id: like.id,
        createdAt: like.createdAt,
        updatedAt: like.updatedAt,
        user: like.user,
        type: targetType,
      }

      // 根据目标类型添加目标信息
      switch (targetType) {
        case "article":
          return {
            ...baseItem,
            target: {
              id: like.article.id,
              title: like.article.title,
            },
          }
        case "setting":
          return {
            ...baseItem,
            target: {
              id: like.setting.id,
              name: like.setting.name,
            },
          }
        case "comment":
          return {
            ...baseItem,
            target: {
              id: like.comment.id,
              content: like.comment.content,
            },
          }
        default:
          return baseItem
      }
    })

    // 构造返回结果
    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      likes: formattedLikes,
    }

    res.result(result, "获取点赞详情成功")
  } catch (error) {
    console.error("获取点赞详情失败:", error)
    res.result(void 0, "获取点赞详情失败", false)
  }
})

export default router

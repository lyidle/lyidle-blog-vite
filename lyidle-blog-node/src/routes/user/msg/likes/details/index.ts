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

  // 确定目标类型和ID
  let targetType: string | null = null
  let targetId: string | null = null
  let targetModel: any
  let targetAttributes: string[] = []

  if (articleId) {
    whereCondition.articleId = articleId
    targetType = "article"
    targetId = articleId as string
    targetModel = Article
    targetAttributes = ["id", "title", "content"]
  } else if (settingId) {
    whereCondition.settingId = settingId
    targetType = "setting"
    targetId = settingId as string
    targetModel = Setting
    targetAttributes = ["id", "name", "content"]
  } else if (commentId) {
    whereCondition.commentId = commentId
    targetType = "comment"
    targetId = commentId as string
    targetModel = Comment
    targetAttributes = ["id", "content"]
  }

  // 非法 判断
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

    // 查询点赞记录
    const { count, rows } = await LikeDislike.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "account", "nickName", "avatar"],
        },
      ],
      order: [
        ["updatedAt", "desc"],
        ["id", "desc"],
      ],
      limit: pageSize,
      offset,
      distinct: true,
      attributes: ["id", "createdAt", "updatedAt"],
    })

    // 构造返回结果
    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      target: {
        id: findtargetModel.id,
        ...(targetType === "article" && {
          ...findtargetModel,
          type: targetType,
        }),
        ...(targetType === "setting" && {
          ...findtargetModel,
          type: targetType,
        }),
        ...(targetType === "comment" && {
          ...findtargetModel,
          type: targetType,
        }),
      },
      likes: rows,
    }

    res.result(result, "获取点赞详情成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取点赞详情失败", false)
    )
  }
})

export default router

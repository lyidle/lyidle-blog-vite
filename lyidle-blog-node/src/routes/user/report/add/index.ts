import express from "express"
// 引入 api
const router = express.Router()
// 引入 模型
const { Report, Article, Comment, Message, User } = require("@/db/models")

router.post("/", async (req, res, next) => {
  // 从请求体和认证信息中获取参数
  const {
    type,
    targetUserId,
    name,
    desc,
    articleId,
    commentId,
    msgId,
    settingId,
  } = req.body
  const userId = req.auth.id // 从认证信息获取举报人ID
  const msg = "创建举报信息"

  try {
    if (+targetUserId === +userId)
      return res.result(null, "targetUserId不能是自身", false)

    // 验证必填字段
    if (!type || !targetUserId || !name || !desc) {
      return res.result(
        null,
        "缺少必要参数：type、targetUserId、name、desc",
        false
      )
    }

    // 验证举报类型有效性
    const validTypes = ["article", "comment", "msg", "user"] as const
    type ValidTypes = (typeof validTypes)[number]
    if (!validTypes.includes(type)) {
      return res.result(
        null,
        "无效的举报类型，必须是: article, comment, msg, user 之一",
        false
      )
    }

    if (!Number.isInteger(+targetUserId))
      return res.result(null, `targetUserId需要是一个整数`, false)

    // 根据不同类型验证对应ID字段
    const typeIdValidations = {
      article: () => articleId && Number.isInteger(+articleId),
      setting: () => settingId && Number.isInteger(+settingId),
      // 是评论需要 article 或 setting 的 id
      comment: () =>
        commentId &&
        Number.isInteger(+commentId) &&
        (typeIdValidations.article() || typeIdValidations.setting()),
      msg: () => msgId && Number.isInteger(+msgId),
      user: () => true, // 用户类型不需要额外验证
    }

    if (!typeIdValidations[type]())
      return res.result(
        null,
        `类型为${type}时，必须提供对应的ID字段,或id字段不合法`,
        false
      )

    // 判断 id个数是否 冲突
    let num = 0
    targetUserId && ++num
    articleId && ++num
    settingId && ++num
    commentId && ++num
    msgId && ++num
    if (type === "user")
      if (num !== 1)
        // 时user则 需要一个 targetUserId就够了
        return res.result(void 0, `类型为${type}时，不能有其他的id`, false)
    if (type !== "user" && type === "comment" && num !== 3)
      return res.result(void 0, `类型为${type}时，id只能有3个id`, false)
    // 则 是两个 id 一个 targetUserId 和 type对应的 id
    if (type !== "user" && type !== "comment" && num !== 2)
      return res.result(void 0, `类型为${type}时，只能有两个id`, false)

    // 构建举报数据对象
    const reportData = {
      targetType: type,
      targetUserId,
      filterType: name,
      desc,
      userId,
      articleId: articleId || null,
      commentId: commentId || null,
      msgId: msgId || null,
      settingId: settingId || null,
    }

    // 判断对应的 是否存在
    let isFind = false

    if ((type as ValidTypes) === "article") {
      const is = await Article.findOne({
        where: {
          userId: targetUserId,
          id: articleId,
        },
      })
      isFind = is ? true : false
    }

    if ((type as ValidTypes) === "comment") {
      const is = await Comment.findOne({
        where: {
          userId: targetUserId,
          id: commentId,
        },
      })
      isFind = is ? true : false
    }

    if ((type as ValidTypes) === "msg") {
      const is = await Message.findOne({
        where: {
          senderId: targetUserId,
          id: msgId,
        },
      })
      isFind = is ? true : false
    }

    if ((type as ValidTypes) === "user") {
      const is = await User.findByPk(targetUserId)
      isFind = is ? true : false
    }

    if (!isFind)
      return res.result(null, msg + `失败,没有在用户中找到${type}的信息`, false)

    // 创建举报记录
    const newReport = await Report.create(reportData)

    // 成功返回新建的举报信息
    res.result(newReport, msg + "成功~")
  } catch (error) {
    // 错误处理
    res.validateAuth(error, next, () => res.result(null, msg + "失败~", false))
  }
})
export default router

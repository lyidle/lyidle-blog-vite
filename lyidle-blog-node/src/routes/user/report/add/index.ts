import express from "express"
// 引入 api
const router = express.Router()
// 引入 模型
const { Report } = require("@/db/models")

router.post("/", async (req, res, next) => {
  // 从请求体和认证信息中获取参数
  const { type, targetUserId, name, desc, articleId, commentId, msgId } =
    req.body
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
    const validTypes = ["article", "comment", "msg", "user"]
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
      article: () => articleId && !Number.isInteger(+articleId),
      comment: () => commentId && !Number.isInteger(+commentId),
      msg: () => msgId && !Number.isInteger(+msgId),
      user: () => true, // 用户类型不需要额外验证
    }

    if (!typeIdValidations[type]())
      return res.result(null, `类型为${type}时，必须提供对应的ID字段`, false)

    // 判断 id个数是否 冲突
    let num = 0
    targetUserId && ++num
    articleId && ++num
    commentId && ++num
    msgId && ++num
    if (type === "user") {
      // 时user则 需要一个 targetUserId就够了
      if (num !== 1)
        return res.result(void 0, `类型为${type}时，不能有其他的id`, false)
    }
    // 则 是两个 id 一个 targetUserId 和 type对应的 id
    else if (num !== 2)
      return res.result(void 0, `类型为${type}时，只能有两个id`, false)

    // 构建举报数据对象
    const reportData = {
      targetType: type,
      targetUserId,
      filterType: name,
      desc,
      userId,
      // 根据类型设置关联ID
      ...(type === "article" && { articleId }),
      ...(type === "comment" && { commentId }),
      ...(type === "msg" && { msgId }),
    }

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

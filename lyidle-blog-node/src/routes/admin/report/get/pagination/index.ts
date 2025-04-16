import express from "express"
const router = express.Router()
// 引入模型
const { Report } = require("@/db/models")
router.get("/", async (req, res, next) => {
  let { currentPage, pageSize, type, isSend } = req.query // 从查询参数获取分页信息
  const msg = `获取${type}的举报数据` // 基础消息模板

  try {
    // 验证举报类型参数是否有效
    const validTypes = ["article", "comment", "msg", "user"]
    if (!validTypes.includes(type as string)) {
      return res.result(
        void 0,
        "无效的type参数，必须是: article, comment, msg, user 之一",
        false
      )
    }
    const validateSend = ["false", "true"]
    if (!validateSend.includes(isSend as string))
      return res.result(
        void 0,
        "无效的isSend参数，必须是: false、true之一",
        false
      )

    // @ts-ignore
    isSend === "true" ? (isSend = true) : (isSend = false)

    // 处理分页参数，确保为正数
    const page = Math.abs(Number(currentPage)) || 1
    const size = Math.abs(Number(pageSize)) || 10
    const offset = (page - 1) * size

    // 查询数据库，获取分页数据和总数
    const { count, rows } = await Report.findAndCountAll({
      where: { targetType: type, isSend }, // 按类型过滤
      limit: size, // 每页数量
      offset: offset, // 偏移量
      order: [["createdAt", "desc"]], // 按创建时间降序排列
    })

    // 构造返回数据格式
    const result = {
      pagination: {
        total: count, // 总记录数
        currentPage: page, // 当前页码
        pageSize: size, // 每页大小
      },
      list: rows, // 当前页数据列表
    }

    // 成功返回结果
    res.result(result, msg + "成功~")
  } catch (error) {
    // 错误处理，使用项目约定的验证和返回格式
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + "失败~", false)
    )
  }
})
export default router

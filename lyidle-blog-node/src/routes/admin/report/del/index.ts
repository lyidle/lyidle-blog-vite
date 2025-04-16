import express from "express"
const router = express.Router()
// 引入模型
const { Report } = require("@/db/models")
router.delete("/:reportId", async (req, res, next) => {
  const msg = `删除举报数据` // 基础消息模板
  const reportId = req.params.reportId
  try {
    const findReport = await Report.findByPk(reportId)
    // 验证
    if (!findReport)
      return res.result(void 0, msg + "失败,没有找到举报信息", false)
    findReport.destroy({ force: true })

    // 成功返回结果
    res.result(void 0, msg + "成功~")
  } catch (error) {
    // 错误处理，使用项目约定的验证和返回格式
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + "失败~", false)
    )
  }
})
export default router

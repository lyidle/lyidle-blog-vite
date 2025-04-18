import express from "express"
const router = express.Router()
// 引入模型
const { SystemMessage } = require("@/db/models")
// 分页获取系统通知
router.get("/", async (req, res, next) => {
  const userId = req.auth.id
  const { query } = req
  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize

  try {
    const { count, rows } = await SystemMessage.findAndCountAll({
      where: {
        userId,
      },
      order: [["createdAt", "desc"], [["id", "desc"]]],
      limit: pageSize,
      offset,
    })

    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      list: rows,
    }

    return res.result(result, "获取系统通知成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取系统通知失败~", false)
    )
  }
})
export default router

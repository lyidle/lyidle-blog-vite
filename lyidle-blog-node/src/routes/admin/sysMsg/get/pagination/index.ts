import express from "express"
const router = express.Router()

// 引入 模型
const { SystemMessage } = require("@/db/models")

router.get("/", async (req, res, next) => {
  const msg = "获取系统消息"
  try {
    const { query } = req

    /**
     * @pagesize 每页显示条目个数
     * @currentPage 当前页
     */
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    const { count, rows } = await SystemMessage.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset,
    })

    // 返回 结果
    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      list: rows,
    }

    res.result(result, msg + "成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + "失败~", false)
    )
  }
})
export default router

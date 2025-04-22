import express from "express"
const router = express.Router()
// 引入模型
const { SiteTime } = require("@/db/models")

// 分页获取网站进程
router.get("/", async (req, res, next) => {
  const { query } = req
  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize

  try {
    const { count, rows } = await SiteTime.findAndCountAll({
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

    return res.result(result, "获取网站进程成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取网站进程失败~", false)
    )
  }
})
export default router

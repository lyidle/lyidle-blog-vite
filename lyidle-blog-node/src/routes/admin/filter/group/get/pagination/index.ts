import express from "express"
const router = express.Router()
// 引入模型
const { FilterType } = require("@/db/models")
router.get("/", async (req, res, next) => {
  const msg = "获取所有敏感词分类"
  let { currentPage, pageSize } = req.query
  try {
    // 处理分页参数，确保为正数
    const page = Math.abs(Number(currentPage)) || 1
    const size = Math.abs(Number(pageSize)) || 10
    const offset = (page - 1) * size

    const { count, rows } = await FilterType.findAndCountAll({
      order: [["createdAt", "desc"]],
      limit: size, // 每页数量
      offset: offset, // 偏移量
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
    res.result(result, msg + `成功~`)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + `失败~`, false)
    )
  }
})
export default router

import express from "express"
const router = express.Router()
// 引入模型
const { FilterType } = require("@/db/models")
router.get("/", async (req, res, next) => {
  const msg = "获取所有分类"
  try {
    const types = await FilterType.findAll({
      attributes: ["name", "desc"], // 只返回名称和描述
      order: [["name", "asc"]], // 按名称排序
    })
    res.result(types, msg + `成功~`)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + `失败~`, false)
    )
  }
})
export default router

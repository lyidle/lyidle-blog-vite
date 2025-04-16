import express from "express"
const router = express.Router()
// 引入模型
const { FilterType } = require("@/db/models")

router.post("/", async (req, res, next) => {
  const msg = "创建敏感词分类"
  const { name, desc } = req.body
  if (!name) return res.result(void 0, msg + `失败,必须要有参数：name`, false)

  try {
    const newFilterType = await FilterType.create({
      name,
      desc: desc || null,
    })
    res.result(newFilterType, msg + `成功~`)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + `失败~`, false)
    )
  }
})
export default router

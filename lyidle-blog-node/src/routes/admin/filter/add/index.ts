import express from "express"
const router = express.Router()
// 引入模型
const { Filter } = require("@/db/models")

router.post("/", async (req, res, next) => {
  const msg = "创建敏感词"
  const { word, type } = req.body
  if (!word || !type)
    return res.result(void 0, msg + `失败,必须要有参数：word、type`, false)

  try {
    const newFilter = await Filter.create({
      word,
      type,
    })
    res.result(newFilter, msg + `成功~`)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + `失败~`, false)
    )
  }
})
export default router

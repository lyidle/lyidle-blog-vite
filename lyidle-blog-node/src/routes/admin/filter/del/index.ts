import express from "express"
const router = express.Router()
// 引入模型
const { Filter } = require("@/db/models")

router.delete("/:filterId", async (req, res, next) => {
  const filterId = req.params.filterId
  const msg = "删除敏感词"
  try {
    const findFilter = await Filter.findByPk(filterId)
    if (!findFilter) return res.result(void 0, msg + `失败,没有找到数据`, false)
    await findFilter.destroy({ force: true })
    res.result(void 0, msg + `成功~`)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + `失败~`, false)
    )
  }
})
export default router

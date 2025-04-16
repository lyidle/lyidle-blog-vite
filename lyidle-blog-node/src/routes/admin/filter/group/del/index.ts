import express from "express"
const router = express.Router()
// 引入模型
const { FilterType } = require("@/db/models")

router.delete("/:filterTypeId", async (req, res, next) => {
  const filterTypeId = req.params.filterTypeId
  const msg = "删除敏感词分类"
  try {
    const findFilterType = await FilterType.findByPk(filterTypeId)
    if (!findFilterType)
      return res.result(void 0, msg + `失败,没有找到数据`, false)
    await findFilterType.destroy({ force: true })
    res.result(void 0, msg + `成功~`)
  } catch (error: any) {
    // 数据库约束错误
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.result(
        void 0,
        msg + `失败,需要把相关的敏感词删除完才能进行删除`,
        false
      )
    }
    res.validateAuth(error, next, () =>
      res.result(void 0, msg + `失败~`, false)
    )
  }
})
export default router

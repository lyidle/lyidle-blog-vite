import express from "express"
const router = express.Router()
const { SiteTime } = require("@/db/models")

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params

  // 验证必要字段
  if (!id || !Number.isInteger(Number(id))) {
    return res.result(void 0, "ID必须为有效整数", false)
  }

  try {
    // 查找记录
    const record = await SiteTime.findByPk(id)
    if (!record) {
      return res.result(void 0, "未找到该网站进程记录", false)
    }

    // 删除记录
    await record.destroy()

    return res.result({ id }, "删除网站进程成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "删除网站进程失败~", false)
    )
  }
})

export default router

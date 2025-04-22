import express from "express"
const router = express.Router()
const { SiteTime } = require("@/db/models")

router.put("/", async (req, res, next) => {
  const { id, content } = req.body
  const trimmedContent = content?.trim()

  // 验证必要字段
  if (!id || !Number.isInteger(Number(id))) {
    return res.result(void 0, "ID必须为有效整数", false)
  }

  if (!trimmedContent) {
    return res.result(void 0, "内容不能为空", false)
  }

  if (typeof trimmedContent !== "string") {
    return res.result(void 0, "内容必须是字符串", false)
  }

  try {
    // 查找记录
    const record = await SiteTime.findByPk(id)
    if (!record) {
      return res.result(void 0, "未找到该网站进程记录", false)
    }

    // 更新记录
    const updatedRecord = await record.update({
      content: trimmedContent,
    })

    return res.result(updatedRecord, "更新网站进程成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "更新网站进程失败~", false)
    )
  }
})

export default router

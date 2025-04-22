import express from "express"
const router = express.Router()
// 引入模型
const { SiteTime } = require("@/db/models")

router.post("/", async (req, res, next) => {
  let { content } = req.body
  content = content.trim()

  // 更详细的验证
  if (!content) {
    return res.result(void 0, "内容不能为空", false)
  }

  if (typeof content !== "string") {
    return res.result(void 0, "内容必须是字符串", false)
  }

  try {
    const newRecord = await SiteTime.create({
      content: content.trim(), // 去除前后空格
    })

    return res.result(newRecord, "添加网站进程成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "添加网站进程失败~", false)
    )
  }
})

export default router

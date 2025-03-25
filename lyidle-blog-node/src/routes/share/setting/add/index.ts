import express from "express"

// 引入 模型
const { Share, Setting } = require("@/db/models")
const router = express.Router()
// 增加设置分享
router.post("/:settingId", async (req, res, next) => {
  const { settingId } = req.params

  // 参数校验
  if (!settingId) {
    return res.result(void 0, "settingId 是必传参数", false)
  }

  try {
    // 验证设置是否存在
    const setting = await Setting.findByPk(settingId)
    if (!setting) {
      return res.result(void 0, "设置不存在", false)
    }

    // 创建分享记录
    await Share.create({
      settingId,
      shareType: "setting",
    })

    res.result(void 0, "分享成功")
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () => res.result(void 0, "分享失败", false))
  }
})
export default router

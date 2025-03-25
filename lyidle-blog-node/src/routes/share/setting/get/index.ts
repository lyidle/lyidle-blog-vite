import express from "express"
// 引入 模型
const { Share, Setting } = require("@/db/models")
const router = express.Router()

// 获取设置分享数量
router.get("/:settingId", async (req, res, next) => {
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

    // 获取分享数量
    const count = await Share.count({
      where: {
        settingId,
        shareType: "setting",
      },
    })

    res.result(count, "获取分享数量成功")
  } catch (error) {
    // 捕获错误并返回失败响应
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取分享数量失败", false)
    )
  }
})

export default router

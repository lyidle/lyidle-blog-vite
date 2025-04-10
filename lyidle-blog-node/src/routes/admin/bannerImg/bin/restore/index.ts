import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入 模型
const { BannerImg } = require("@/db/models")
const router = express.Router()

// 恢复背景
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  if (!id) return res.result(void 0, "恢复背景失败,id是必传项", false)

  try {
    const findBanner = await BannerImg.findByPk(id, { paranoid: false })

    if (!findBanner)
      return res.result(void 0, "恢复背景失败,没有找到背景数据", false)

    // 恢复 背景
    await findBanner.restore()

    res.result(void 0, "恢复背景成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "恢复背景失败~", false)
    )
  }
})
export default router

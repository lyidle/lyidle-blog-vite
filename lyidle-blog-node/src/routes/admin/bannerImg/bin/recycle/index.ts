import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入redis
import { delKey } from "@/utils/redis"
// 引入 模型
const { BannerImg } = require("@/db/models")
const router = express.Router()

// 禁用背景
router.put(
  "/:id",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    // 获取 所有的 背景的 key
    let cacheKey = "bannerImg:*"
    let cacheKey2 = "bannerImg:bin:*"
    const { id } = req.params
    if (!id) return res.result(void 0, "禁用背景失败,id是必传项", false)

    try {
      const findBanner = await BannerImg.findByPk(id, { paranoid: false })

      if (!findBanner)
        return res.result(void 0, "禁用背景失败,没有找到背景数据", false)

      // 软删除 背景
      await findBanner.destroy()

      // 删除 缓存
      await delKey(cacheKey)
      await delKey(cacheKey2)
      res.result(void 0, "禁用背景成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "禁用背景失败~", false)
      )
    }
  }
)
export default router

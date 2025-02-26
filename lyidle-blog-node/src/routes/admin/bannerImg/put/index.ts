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

// 更新 背景
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    // 获取 所有的 背景的 key
    let cacheKey = "bannerImg:*"
    const { id, dark, light, height } = req.body
    if (!id) return res.result(void 0, "更新背景失败,id是必传项哦~", false)

    try {
      const findBanner = await BannerImg.findByPk(id)
      if (!findBanner)
        return res.result(void 0, "更新背景失败,没有找到背景数据哦~", false)
      // 更新 数据
      await findBanner.set("dark", dark || null)
      await findBanner.set("light", light || null)
      await findBanner.set("height", height || null)
      // 保存
      await findBanner.save()

      // 删除 缓存
      await delKey(cacheKey)
      res.result(void 0, "更新背景成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "更新背景失败~", false)
      )
    }
  }
)
export default router

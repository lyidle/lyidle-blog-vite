import { getKey, setKey } from "@/utils/redis"
import express, { NextFunction, Request, Response } from "express"
// 引入 模型
const { BannerImg } = require("@/db/models")

const router = express.Router()

// 获取背景列表
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let cacheKey = "bannerImg:*"
    const cacheValue = await getKey(cacheKey)
    // 判断有无 缓存
    if (cacheValue) return res.result(cacheValue, "获取背景成功~")

    // 查询 所有的 bannerImg
    const findBanner = await BannerImg.findAll({ paranoid: false })

    if (!findBanner.length) {
      return res.result(void 0, "获取背景失败~", false)
    }

    // 设置 缓存
    await setKey(cacheKey, findBanner)
    return res.result(findBanner, "获取背景成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取背景失败~", false)
    )
  }
})

export default router

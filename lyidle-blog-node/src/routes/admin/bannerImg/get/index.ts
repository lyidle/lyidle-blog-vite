import { getKey, setKey } from "@/utils/redis"
import express, { NextFunction, Request, Response } from "express"
import { Op } from "sequelize"
// 引入 模型
const { BannerImg } = require("@/db/models")

const router = express.Router()

// 获取背景列表
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  // 判断是否 读取 垃圾桶的 信息
  const { isBin } = req.query

  try {
    const _bool = JSON.parse(isBin as string)
    let cacheKey = "bannerImg:*"
    if (_bool) cacheKey = "bannerImg:bin:*"
    const cacheValue = await getKey(cacheKey)
    // 判断有无 缓存
    if (cacheValue) return res.result(cacheValue, "获取背景成功~")

    // 查询 所有的 bannerImg
    const findBanner = await BannerImg.findAll({ paranoid: !_bool })

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
// 获取背景列表 pagination
router.get(
  "/manager",
  async (req: Request, res: Response, next: NextFunction) => {
    // 判断是否 读取 垃圾桶的 信息
    const { name, notName } = req.query
    const { query } = req
    /**
     * @pagesize 每页显示条目个数
     * @currentPage 当前页
     */
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize
    try {
      // 查询命令
      const commend: any = {
        limit: pageSize,
        offset,
        paranoid: false,
        where: {},
      }

      // 是否查询
      if (name) commend.where.name = { [Op.like]: `%${name}%` }
      if (notName) commend.where.name = { [Op.notLike]: `%${notName}%` }
      if (name && notName) {
        // 同时满足 name 包含某个值，且不包含 notName
        commend.where.name = {
          [Op.and]: [
            { [Op.like]: `%${name}%` }, // 包含 name
            { [Op.notLike]: `%${notName}%` }, // 不包含 notName
          ],
        }
      }

      // 查询 所有的 bannerImg
      const { count, rows } = await BannerImg.findAndCountAll(commend)

      if (!count) {
        return res.result(void 0, "获取背景失败~", false)
      }

      const result = {
        pagination: {
          total: count,
          currentPage,
          pageSize,
        },
        banners: rows,
      }

      return res.result(result, "获取背景成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "获取背景失败~", false)
      )
    }
  }
)
export default router

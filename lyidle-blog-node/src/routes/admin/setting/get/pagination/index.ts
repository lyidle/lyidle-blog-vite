import express, { NextFunction, Request, Response } from "express"
import { Op } from "sequelize"
const { Setting } = require("@/db/models")
const router = express.Router()

// 获取设置信息列表
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req
  const { name } = req.query
  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize
  try {
    const commend = {
      limit: pageSize,
      offset,
      where: name && {
        name: { [Op.like]: `%${name}%` },
      },
    }
    const { count, rows } = await Setting.findAndCountAll(commend)

    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      setting: rows,
    }

    res.result(result, "获取所有设置信息成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取所有设置信息失败", false)
    )
  }
})
export default router

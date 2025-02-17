import express, { NextFunction, Request, Response } from "express"
const { Role } = require("@/db/models")
const router = express.Router()

// 获取权限菜单列表
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req
  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize

  try {
    const { count, rows } = await Role.findAndCountAll({
      limit: pageSize,
      offset,
    })

    // 判断是否有 角色
    if (!count) return res.result(void 0, "服务器角色未初始化哦~", false)

    const cacheValue = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      roles: rows,
    }

    res.result(cacheValue, "获取所有角色成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取所有角色失败哦~", false)
    )
  }
})
export default router

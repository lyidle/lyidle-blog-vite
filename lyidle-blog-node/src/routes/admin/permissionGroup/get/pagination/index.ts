import express, { NextFunction, Request, Response } from "express"
import { Op } from "sequelize"
const { PermissionGroup, Permission } = require("@/db/models")
const router = express.Router()

// 获取权限组列表
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
      include: [
        {
          model: Permission,
          as: "children",
          through: { attributes: [] },
        },
      ],
      limit: pageSize,
      offset,
      where: name && {
        name: { [Op.like]: `%${name}%` },
      },
    }
    const { count, rows } = await PermissionGroup.findAndCountAll(commend)

    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      groups: rows,
    }

    res.result(result, "获取所有权限组成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取所有权限组失败", false)
    )
  }
})
export default router

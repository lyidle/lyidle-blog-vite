import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入 查询方法
import { Op } from "sequelize"
// 引入 模型
const { Permission } = require("@/db/models")
const router = express.Router()
// 查询 所有 软删除的 权限
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req
  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize
  // 提取 query
  const { name } = query
  try {
    // 查询命令
    const commend: any = {
      paranoid: false,
      where: {
        isBin: {
          [Op.not]: null, // 不是 NULL
        },
      },
      limit: pageSize,
      offset,
    }

    // 判断是否 查询
    if (name)
      commend.where.name = {
        [Op.like]: `%${name}%`,
      }
    // 查询 所有 软删除的 权限
    const { count, rows } = await Permission.findAndCountAll(commend)

    // 返回的 结果 汇总
    const result = {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      permissions: rows,
    }

    res.result(result, "查询权限回收站列表成功~")
  } catch (error) {
    res.result(void 0, "查询权限回收站列表失败~", false)
  }
})
// 挂载路由
export default router

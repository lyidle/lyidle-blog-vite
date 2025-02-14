import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 模型
const { Permission } = require("@/db/models")
const db = require("@/db/models")
const router = express.Router()
// 创建权限菜单
router.post(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, parentId } = req.body

    if (!name)
      return res.result(void 0, "创建权限菜单name是必须要有的哦~", false)

    // 开启事务
    const transaction = await db.sequelize.transaction()

    try {
      const setData = {
        name,
        description,
        parentId,
      }

      // 创建权限菜单
      const newPermission = await Permission.create(setData, { transaction })

      // 提交事务
      await transaction.commit()

      res.result(newPermission, "创建权限菜单成功~")
    } catch (error) {
      await transaction.rollback() // 回滚事务
      res.validateAuth(error, next, () =>
        res.result(void 0, "创建权限菜单失败~", false)
      )
    }
  }
)
export default router

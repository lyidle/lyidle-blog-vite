import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 模型
const { PermissionGroup } = require("@/db/models")
const router = express.Router()

// 恢复权限组
router.put(
  "/:id",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    if (!id) return res.result(void 0, "恢复权限组失败,id是必传项", false)

    try {
      const findPermissionGroup = await PermissionGroup.findByPk(id, {
        paranoid: false,
      })

      if (!findPermissionGroup)
        return res.result(void 0, "恢复权限组失败,没有找到权限组数据", false)

      // 恢复 权限组
      await findPermissionGroup.restore()

      res.result(void 0, "恢复权限组成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "恢复权限组失败~", false)
      )
    }
  }
)
export default router

import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 模型
const { Permission } = require("@/db/models")
const router = express.Router()

// 恢复权限
router.put(
  "/:id",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    if (!id) return res.result(void 0, "恢复权限失败,id是必传项", false)

    try {
      const findPermission = await Permission.findByPk(id, { paranoid: false })

      if (!findPermission)
        return res.result(void 0, "恢复权限失败,没有找到权限数据", false)

      // 恢复 权限
      await findPermission.restore()

      res.result(void 0, "恢复权限成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "恢复权限失败~", false)
      )
    }
  }
)
export default router

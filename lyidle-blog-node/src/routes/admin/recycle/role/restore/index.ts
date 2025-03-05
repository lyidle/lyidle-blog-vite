import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 模型
const { Role } = require("@/db/models")
const router = express.Router()

// 恢复角色
router.put(
  "/:id",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    if (!id) return res.result(void 0, "恢复角色失败,id是必传项", false)

    try {
      const findRole = await Role.findByPk(id, { paranoid: false })

      if (!findRole)
        return res.result(void 0, "恢复角色失败,没有找到角色数据", false)

      // 恢复 角色
      await findRole.restore()

      res.result(void 0, "恢复角色成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "恢复角色失败~", false)
      )
    }
  }
)
export default router

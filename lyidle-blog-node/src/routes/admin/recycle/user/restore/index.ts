import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 模型
const { User } = require("@/db/models")
const router = express.Router()

// 恢复用户
router.put(
  "/:id",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    if (!id) return res.result(void 0, "恢复用户失败,id是必传项", false)

    try {
      const findUser = await User.findByPk(id, { paranoid: false })

      if (!findUser)
        return res.result(void 0, "恢复用户失败,没有找到用户数据", false)

      // 恢复 用户
      await findUser.restore()

      res.result(void 0, "恢复用户成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "恢复用户失败~", false)
      )
    }
  }
)
export default router

import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 模型
const { Menu } = require("@/db/models")
const router = express.Router()

// 恢复菜单
router.put(
  "/:id",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    if (!id) return res.result(void 0, "恢复菜单失败,id是必传项", false)

    try {
      const findMenu = await Menu.findByPk(id, { paranoid: false })

      if (!findMenu)
        return res.result(void 0, "恢复菜单失败,没有找到菜单数据", false)

      // 恢复 菜单
      await findMenu.restore()

      res.result(void 0, "恢复菜单成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "恢复菜单失败~", false)
      )
    }
  }
)
export default router

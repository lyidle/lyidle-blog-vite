import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 模型
const { Setting } = require("@/db/models")
const router = express.Router()
// 引入redis 设置缓存
import { delKey } from "@/utils/redis"
router.delete(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 提取需要的信息
      const { name } = req.query

      // 汇总 错误信息
      if (!name) return res.result(void 0, "name是必传项", false)
      const findSetting = await Setting.findOne({ where: { name } })
      if (!findSetting)
        return res.result(void 0, "没有找到对应的设置信息~", false)
      await findSetting.destroy()
      await delKey(`setting:${name}`)
      res.result(void 0, "删除设置信息成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "删除设置信息失败~", false)
      )
    }
  }
)
// 挂载路由
export default router

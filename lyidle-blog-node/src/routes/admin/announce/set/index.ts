import express from "express"
// 类型
import type { Request, Response, NextFunction } from "express"
// 引入权限判断
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入redis 更新缓存
import { setKey } from "@/utils/redis"
// 引入模型
const { Setting } = require("@/db/models")
const router = express.Router()
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { announce } = req.body
      if (!announce) return res.result(void 0, "announce是必传项~", false)
      const findAnnounce = await Setting.findOne({
        where: { name: "公告" },
      })
      // 设置 announce
      await findAnnounce.set("content", announce)
      // 保存
      const { dataValues } = await findAnnounce.save()
      // 更新缓存
      await setKey("setting:公告", dataValues)
      return res.result(void 0, "设置通知成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "设置通知失败~", false)
      )
    }
  }
)
export default router

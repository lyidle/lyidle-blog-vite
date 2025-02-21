import { delKey } from "@/utils/redis"
import express, { NextFunction, Request, Response } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 模型
const { Role } = require("@/db/models")
const router = express.Router()

// 环境变量
const default_owner = process.env.default_owner!

// 获取权限菜单列表
router.post(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, desc } = req.body

      if (name === default_owner)
        return res.result(
          void 0,
          `创建角色失败哦，不能创建${default_owner}角色哦~`,
          false
        )

      const setData = {
        name,
        desc,
      }

      // 创建权限
      const result = await Role.create(setData)

      // 获取所有角色 保存的键
      const cacheKey = "roles:*"

      // 返回并 删除缓存
      await delKey(cacheKey)
      res.result(result, "创建角色成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "创建角色失败哦~", false)
      )
    }
  }
)
export default router

import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
import { delKey } from "@/utils/redis"
// 引入 模型
const { PermissionGroup } = require("@/db/models")
const router = express.Router()
// 创建权限菜单
router.post(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, desc } = req.body

    // 保存 redis 的键
    let cacheKey = `permissionGroup:*`

    if (!name)
      return res.result(void 0, "创建权限菜单name是必须要有的哦~", false)

    try {
      const setData = {
        name,
        desc,
      }

      // 创建权限菜单
      const newPermissionGroup = await PermissionGroup.create(setData)

      // 删除 缓存
      await delKey(cacheKey)
      res.result(newPermissionGroup, "创建权限菜单成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "创建权限菜单失败~", false)
      )
    }
  }
)
export default router

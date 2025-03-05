import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
import { delKey } from "@/utils/redis"
// 引入 模型
const { Permission } = require("@/db/models")
const router = express.Router()
// 创建权限子菜单
router.post(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, desc } = req.body

    // 保存 redis 的键
    const cacheKey = `permissions:*`
    // 获取所有角色 保存的键
    const cacheKeyRole = "roles:*"
    // 获取所有权限组 保存的键
    const cacheKeyGroup = `permissionGroup:*`

    if (!name)
      return res.result(void 0, "创建权限子菜单name是必须要有的", false)

    try {
      const setData = {
        name,
        desc,
      }

      // 创建权限子菜单
      const newPermission = await Permission.create(setData)

      // 删除 缓存
      await delKey(cacheKey)
      await delKey(cacheKeyRole)
      await delKey(cacheKeyGroup)
      res.result(newPermission, "创建权限子菜单成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "创建权限子菜单失败~", false)
      )
    }
  }
)
export default router

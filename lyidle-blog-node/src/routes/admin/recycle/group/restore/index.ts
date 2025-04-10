import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// redis
import { delKey } from "@/utils/redis"
// 引入 模型
const { PermissionGroup } = require("@/db/models")
const router = express.Router()

// 恢复权限组
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // 删除缓存 redis 的键
  let cacheKey = `permissionGroup:*`
  // 获取所有角色 保存的键
  const cacheKeyRole = "roles:*"
  const { id } = req.params
  if (!id) return res.result(void 0, "恢复权限组失败,id是必传项", false)

  try {
    const findPermissionGroup = await PermissionGroup.findByPk(id, {
      paranoid: false,
    })

    if (!findPermissionGroup)
      return res.result(void 0, "恢复权限组失败,没有找到权限组数据", false)

    await findPermissionGroup.restore()

    // 删除缓存
    await delKey(cacheKey)
    await delKey(cacheKeyRole)

    res.result(void 0, "恢复权限组成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "恢复权限组失败~", false)
    )
  }
})
export default router

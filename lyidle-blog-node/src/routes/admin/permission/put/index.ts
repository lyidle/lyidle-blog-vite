import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// redis
import { delKey } from "@/utils/redis"
// 引入 模型
const { Permission } = require("@/db/models")
const db = require("@/db/models")

const router = express.Router()

// 更新 权限菜单
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    // 删除缓存 redis 的键
    let cacheKey = `permission:*`
    const { id, name, description } = req.body

    // 没有 id、name 返回失败
    if (id !== 0 && !id) return res.result(void 0, "id是必传项哦~", false)

    // 开启事务
    const transaction = await db.sequelize.transaction()

    try {
      // 存储查询到的结果

      // 通过id 查找
      let findPermission = await Permission.findByPk(id)

      if (!findPermission) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "没有找到需要更新的权限菜单哦~", false)
      }

      // 找到 了 则更新
      name && findPermission.set("name", name)
      description && findPermission.set("description", description)

      await findPermission.save({ transaction })

      // 提交事务
      await transaction.commit()

      // 删除缓存
      await delKey(cacheKey)
      res.result(void 0, "更新权限菜单成功~")
    } catch (error) {
      await transaction.rollback() // 回滚事务
      res.validateAuth(error, next, () =>
        res.result(void 0, "更新权限菜单失败~", false)
      )
    }
  }
)
export default router

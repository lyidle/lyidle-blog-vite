import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// redis
import { delKey } from "@/utils/redis"
// 引入 去重函数
import { deduplication } from "@/utils/array/deduplication"
// 引入 清除用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 清除菜单缓存的函数
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 模型
const { PermissionGroup, Role, User } = require("@/db/models")
const router = express.Router()

// 恢复权限组
router.put(
  "/:id",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    // 删除缓存 redis 的键
    let cacheKey = `permissionGroup:*`
    // 获取所有角色 保存的键
    const cacheKeyRole = "roles:*"
    const { id } = req.params
    if (!id) return res.result(void 0, "恢复权限组失败,id是必传项", false)

    try {
      const findPermissionGroup = await PermissionGroup.findByPk(id, {
        paranoid: false,
        include: [
          {
            model: Role,
            paranoid: false,
            attributes: ["id"],
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
            include: [
              {
                model: User,
                paranoid: false,
                attributes: ["id", "account"],
                through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
                include: [
                  {
                    model: Role,
                    paranoid: false,
                    attributes: ["name"], // 只获取角色名称
                    through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
                  },
                ],
              },
            ],
          },
        ],
      })

      if (!findPermissionGroup)
        return res.result(void 0, "恢复权限组失败,没有找到权限组数据", false)

      // 恢复 权限组
      const newGroup = await findPermissionGroup.restore()
      // 处理找到的users
      const users = deduplication(
        JSON.parse(JSON.stringify(newGroup)).Roles?.map(
          (item: any) => item.Users
        )
      ).filter(Boolean)

      // 处理找到的roles
      const roles = deduplication(
        users.map((item) => item.Roles?.map((item: any) => item.name))
      ).filter(Boolean) as string[]

      // 删除找到的users的缓存
      await resetUserInfo(users)
      // 删除找到的menus的缓存
      await delMenuRoles(roles)

      // 删除缓存
      await delKey(cacheKey)
      await delKey(cacheKeyRole)

      res.result(void 0, "恢复权限组成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "恢复权限组失败~", false)
      )
    }
  }
)
export default router

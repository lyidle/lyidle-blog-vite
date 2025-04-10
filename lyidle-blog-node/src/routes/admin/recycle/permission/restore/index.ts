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
const { PermissionGroup, Permission, Role, User } = require("@/db/models")
const router = express.Router()

// 恢复权限
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // 保存 redis 的键
  let cacheKey = `permissions:*`
  const { id } = req.params
  if (!id) return res.result(void 0, "恢复权限失败,id是必传项", false)

  try {
    const findPermission = await Permission.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: PermissionGroup,
          paranoid: false,
          attributes: ["id"],
          through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
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
                      attributes: ["name"],
                      through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })

    if (!findPermission)
      return res.result(void 0, "恢复权限失败,没有找到权限数据", false)

    // 恢复 权限
    const newPermission = await findPermission.restore()

    // 处理找到的users
    const users = deduplication(
      JSON.parse(JSON.stringify(newPermission)).PermissionGroups?.map(
        (item: any) => item.Roles.map((item: any) => item.Users)
      )
    )
    // 处理找到的roles
    const roles = deduplication(users.map((item: any) => item.Roles)).filter(
      Boolean
    )

    // 删除找到的users的缓存
    await resetUserInfo(users)
    // 删除找到的roles的缓存
    await delMenuRoles(roles)

    // 删除 缓存
    await delKey(cacheKey)
    res.result(void 0, "恢复权限成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "恢复权限失败~", false)
    )
  }
})
export default router

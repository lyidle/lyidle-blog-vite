import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
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

router.post(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 删除缓存 redis 的键
      const cacheKey = `permissionGroup:*`

      // 得到id
      const { id, permissions } = req.body

      if (!id || !permissions?.length)
        return res.result(
          void 0,
          "设置权限组的权限时,id和permissions是必传项哦~",
          false
        )

      // 查询对应id的信息
      const findGroup = await PermissionGroup.findByPk(id, {
        paranoid: false,
        include: [
          {
            model: Role,
            paranoid: false,
            attributes: ["id"], // 只获取角色名称
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

      // 不存在
      if (!findGroup)
        return res.result(void 0, "设置权限组的权限时,获取权限组失败~", false)

      const findPermission = await Permission.findAll({
        where: { name: permissions },
      })
      // 不存在
      if (!findPermission?.length)
        return res.result(void 0, "设置权限组的权限时,获取权限失败~", false)

      // 设置权限组的权限信息
      await findGroup.setPermissions(findPermission)

      // 处理找到的users
      const users = deduplication(
        JSON.parse(JSON.stringify(findGroup)).Roles?.map(
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
      await delMenuRoles({ roles })

      // 返回并 删除缓存
      await delKey(cacheKey)
      return res.result(findGroup, "获取权限组的权限成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "设置权限组的权限时失败~", false)
      )
    }
  }
)
export default router

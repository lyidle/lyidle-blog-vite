import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
import { delKey } from "@/utils/redis"
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 模型
const { PermissionGroup, Role, User } = require("@/db/models")

const router = express.Router()

router.post(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 获取所有角色 保存的键
      const cacheKey = "roles:*"

      // 得到id
      const { id, groups } = req.body

      if (!id || !groups?.length)
        return res.result(
          void 0,
          "设置角色权限组时,id和groups是必传项哦~",
          false
        )

      // 查询对应id的信息
      const findRole = await Role.findByPk(id, {
        paranoid: false,
        include: [
          {
            model: User,
            paranoid: false,
            attributes: ["id"],
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
            include: [
              {
                model: Role,
                paranoid: false,
                attributes: ["id", "name"], // 只获取角色名称
                through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
                required: true, //按照 role时 过滤 User 的数据
              },
            ],
          },
        ],
      })

      // 不存在
      if (!findRole)
        return res.result(void 0, "设置角色权限组时,获取角色失败~", false)

      const findGroups = await PermissionGroup.findAll({
        where: { name: groups },
      })

      if (!findGroups?.length) {
        return res.result(void 0, "设置角色权限组时,获取权限组失败~", false)
      }
      // 设置角色的权限组信息
      await findRole.setPermissionGroups(findGroups)

      // 处理user
      const users = JSON.parse(JSON.stringify(findRole)).Users
      // 删除 用户的缓存
      await resetUserInfo(users)

      // 返回并 删除缓存
      await delKey(cacheKey)
      return res.result(void 0, "获取角色权限组成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "设置角色权限组时失败~", false)
      )
    }
  }
)
export default router

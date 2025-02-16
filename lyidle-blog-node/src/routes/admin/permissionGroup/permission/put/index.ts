import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
import { delKey } from "@/utils/redis"
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
import { deduplication } from "@/utils/array/deduplication"
// 引入 模型
const { PermissionGroup, Permission, Role, User } = require("@/db/models")
const db = require("@/db/models")

const router = express.Router()

// 更新 权限菜单
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    // 保存 redis 的键
    let cacheKey = `permissions:*`
    // 删除缓存 redis 的键
    const { id, name, desc } = req.body

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
      findPermission.set("desc", desc ? desc : null)

      const result = await findPermission.save({ transaction })
      const permissionId = JSON.parse(JSON.stringify(result)).id
      // 逐级查询到缓存 的 Users
      const findUsers = await Permission.findByPk(permissionId, {
        paranoid: false,
        attributes: ["id"],
        include: [
          {
            model: PermissionGroup,
            attributes: ["id"],
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
              },
            ],
          },
        ],
      })

      // 处理找到的users
      const users = deduplication(
        JSON.parse(JSON.stringify(findUsers)).PermissionGroups?.map(
          (item: any) => item.Roles.map((item: any) => item.Users)
        )
      )

      // 删除找到的users的缓存
      await resetUserInfo(users)

      // 提交事务
      await transaction.commit()

      // 删除 缓存
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

import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// redis
import { delKey } from "@/utils/redis"
import { deduplication } from "@/utils/array/deduplication"
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 模型
const { Role, User } = require("@/db/models")
const db = require("@/db/models")

const router = express.Router()

// 更新 角色
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    // 获取所有角色 保存的键
    const cacheKey = "roles:*"
    const { id, name, desc } = req.body

    // 没有 id、name 返回失败
    if (id !== 0 && !id) return res.result(void 0, "id是必传项哦~", false)

    // 开启事务
    const transaction = await db.sequelize.transaction()

    try {
      // 存储查询到的结果

      // 通过id 查找
      let findRole = await Role.findByPk(id)

      if (!findRole) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "没有找到需要更新的角色哦~", false)
      }

      // 找到 了 则更新
      name && findRole.set("name", name)
      findRole.set("desc", desc ? desc : null)

      const result = await findRole.save({ transaction })
      const roleId = JSON.parse(JSON.stringify(result)).id

      // 逐级查询到缓存 的 Users
      const findUsers = await Role.findByPk(roleId, {
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
      })

      const Users = JSON.parse(JSON.stringify(findUsers))
      // 处理找到的users
      const users = deduplication(Users.Users)
      // 处理找到的roles
      const roles = Users.Users?.map((item: any) =>
        item.Roles?.map((item: any) => item.name)
      )

      // 删除 找到 的Menu用到的缓存
      await delMenuRoles(roles)
      // 删除找到的users的缓存
      await resetUserInfo(users)

      // 提交事务
      await transaction.commit()

      // 删除缓存
      await delKey(cacheKey)
      res.result(void 0, "更新角色成功~")
    } catch (error) {
      await transaction.rollback() // 回滚事务
      res.validateAuth(error, next, () =>
        res.result(void 0, "更新角色失败~", false)
      )
    }
  }
)
export default router

import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入redis
import { delKey } from "@/utils/redis"
// 设置权限
import { setRoles } from "@/utils/db/user/setRoles"
// 引入 模型
const { User, Role } = require("@/db/models")

// 默认的所有者的角色
const default_owner = JSON.parse(process.env.default_owner!)

const router = express.Router()
// 获取当前token用户信息
router.post(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 得到id
      const { id, roles } = req.body

      if (!id || !roles?.length)
        return res.result(void 0, "设置用户权限时,id和roles是必传项哦~", false)

      // 查询对应id的信息
      const findUser = await User.findByPk(id, {
        paranoid: false,
        include: [
          {
            model: Role,
            attributes: ["name"], // 只获取角色名称
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
          },
        ],
      })

      // 不存在
      if (!findUser)
        return res.result(void 0, "设置用户权限时,获取用户信息失败~", false)

      // 设置和创建权限
      const result = await setRoles(roles)

      if (result.length) {
        //  直接重置用户角色
        await findUser.setRoles(result)
      }

      // 删除对应用户信息缓存
      await delKey(`userInfo:${id}`)

      // 判断是否 是 owner
      const isOwner = default_owner.find((item: string) => roles.includes(item))
      // 删除owner的缓存
      if (isOwner) await delKey(`userInfo:owner`)

      return res.result(void 0, "获取用户信息成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "设置用户权限时,获取用户信息失败~", false)
      )
    }
  }
)
export default router

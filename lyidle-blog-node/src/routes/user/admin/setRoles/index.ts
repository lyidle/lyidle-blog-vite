import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 设置权限
import { setRoles } from "@/utils/db/user/setRoles"
// 清除 对应 User 的缓存
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 判断是否是owner
import { isOwner } from "../update"
// 引入 模型
const { User, Role } = require("@/db/models")
const router = express.Router()

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
      await resetUserInfo([findUser], isOwner(roles))

      return res.result(void 0, "设置用户权限成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "设置用户权限时失败~", false)
      )
    }
  }
)
export default router

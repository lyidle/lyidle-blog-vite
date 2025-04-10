import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { isAdmin, jwtMiddleware } from "@/middleware/auth"
// 设置权限
import { setRoles } from "@/utils/db/user/setRoles"
// 清除 对应 User 的缓存
import { isOwner, resetUserInfo } from "@/utils/redis/resetUserInfo"
import { Op } from "sequelize"
// 引入 模型
const { User, Role } = require("@/db/models")
const router = express.Router()

const default_owner = process.env.default_owner!
// 不需要验证 角色信息
// 需要验证 登录用户拥有权限 admin
router.post(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 得到id
      let { id, roles } = req.body

      if (!id || !roles?.length)
        return res.result(void 0, "设置用户权限时,id和roles是必传项", false)
      if (roles.includes(default_owner)) {
        const findRole = await User.findOne({
          attributes: ["id"],
          where: {
            id: { [Op.ne]: id }, // 排除当前的这条记录
          },
          include: [
            {
              model: Role,
              attributes: ["id"],
              through: { attributes: [] },
              where: { name: default_owner },
              required: true,
            },
          ],
        })
        // 找到有 owner 的
        if (findRole)
          return res.result(
            void 0,
            `设置用户权限时,${default_owner}只能拥有一个~`,
            false
          )
      }
      // 查询对应id的信息
      const findUser = await User.findByPk(id, {
        paranoid: false,
        include: [
          {
            model: Role,
            paranoid: false,
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
      })
      if (
        isOwner(
          JSON.parse(JSON.stringify(findUser.Roles)).map((item) => item.name)
        ) &&
        !isOwner(roles)
      )
        return res.result(
          void 0,
          "设置用户权限时,不能修改权限为owner的值~",
          false
        )

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

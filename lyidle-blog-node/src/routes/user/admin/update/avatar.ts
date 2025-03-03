import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 设置token
import { setToken } from "@/utils/token"
// 处理roles
import { _handlerRoles, ReturnRoles } from "@/utils/db/handlerRoles"
// 重置user的缓存
import { isOwner, resetUserInfo } from "@/utils/redis/resetUserInfo"

// 引入 验证 模型中 修改了的 属性字段 的函数
import { validateChangedFields } from "@/utils/db/validateChangedFields"
// 引入 模型
const { User, Role } = require("@/db/models")

const db = require("@/db/models")
const router = express.Router()

// 通过 id查询用户
const findUserByPk = async (id: number) => {
  return await User.findByPk(id, {
    paranoid: false,
    include: [
      {
        model: Role,
        paranoid: false,
        attributes: ["name"], // 只获取角色名称
        through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
      },
    ],
  })
}

// 按照 req.auth.id 查找当前的用户
router.put(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const { avatar } = req.body
    // 开启事务
    const transaction = await db.sequelize.transaction()
    try {
      const id: number | string = req.auth.id
      // 查询
      const findUser = await findUserByPk(id as number)

      // 判断有无找到用户
      if (!findUser) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "没有找到对应用户信息~", false)
      }

      // 可能为 null 的字段
      findUser.set("avatar", avatar || null)

      // 验证 修改了的 属性字段
      await validateChangedFields(findUser)

      // 更新数据库
      const { dataValues } = await findUser.save({ transaction })

      // 处理 token 字段 的roles
      const tokenSetRoles = ReturnRoles([findUser])
      // 重新生成 token
      let token = await setToken({ ...dataValues, roles: tokenSetRoles })

      // 删除对应用户信息缓存
      await resetUserInfo([findUser], isOwner(tokenSetRoles))

      // 提交事务
      await transaction.commit()
      return res.result({ token }, "修改用户头像成功~")
    } catch (error) {
      // 如果出现错误，回滚事务
      await transaction.rollback()
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改用户头像失败~", false)
      )
    }
  }
)
export default router

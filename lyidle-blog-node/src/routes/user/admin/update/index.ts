import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入redis
import { delKey } from "@/utils/redis"
// 设置token
import { setToken } from "@/utils/token"
// 设置用户角色
import { setRoles } from "@/utils/db/user/setRoles"

// 引入 模型
const { User } = require("@/db/models")
const db = require("@/db/models")
const router = express.Router()
router.put(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    // 开启事务 防止 设置role时 用户更新失败 后可以回滚
    const transaction = await db.sequelize.transaction()
    try {
      const { account, pwd, email, avatar, signer, nickName, role } = req.body

      const id = req.auth.id

      // 都没有时返回没有找到
      if (
        !account &&
        !pwd &&
        !email &&
        // 可能为 null
        avatar !== null &&
        !avatar &&
        // 可能为 null
        signer !== null &&
        !signer &&
        !nickName &&
        !role
      ) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "修改用户失败哦~", false)
      }

      // 查询
      const findUser = await User.findByPk(id)

      // 判断有无找到用户
      if (!findUser) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "没有找到对应用户信息~", false)
      }

      // 提取需要的变量
      const { account: userAccount, email: userEmail } = findUser.dataValues

      // 错误信息汇总
      const erroArray: string[] = []
      // 判断是否重复
      if (account && account == userAccount)
        erroArray.push("账号不能和旧的账号重复~")
      // 通过 判断 是否传递账号
      else account && findUser.set("account", account)

      if (email && email == userEmail) erroArray.push("邮箱不能和旧的邮箱重复~")
      // 通过 判断 是否传递邮箱
      else email && findUser.set("email", email)

      // 存在错误信息返回
      if (erroArray.length) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, erroArray, false)
      }

      // 都通过加入更新
      nickName && findUser.set("nickName", nickName)
      pwd && findUser.set("pwd", pwd)
      // 可能为null
      ;(avatar == null || avatar) && findUser.set("avatar", avatar)
      // 可能为null
      ;(signer == null || signer) && findUser.set("signer", signer)

      // 更新数据库
      const { dataValues } = await findUser.save({ transaction })

      // 处理 角色信息
      const roles = role?.length && (await setRoles(role))
      if (roles?.length) {
        await findUser.setRole(roles, { transaction })
      }

      // 提交事务
      await transaction.commit()

      // 改变了pwd 需要重新登录
      if (pwd)
        //删除token
        await delKey(`token:${id}`)
      // 没有 修改 密码 则不需要重新登录
      else await setToken(dataValues)

      // 删除对应用户信息缓存
      await delKey(`userInfo:${id}`)

      return res.result(void 0, "修改用户信息成功~")
    } catch (error) {
      // 如果出现错误，回滚事务
      await transaction.rollback()
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改用户信息失败~", false)
      )
    }
  }
)
export default router

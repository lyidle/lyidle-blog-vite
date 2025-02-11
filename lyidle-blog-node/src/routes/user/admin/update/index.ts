import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入redis
import { setKey, delKey } from "@/utils/redis"
// 设置token
import { setToken } from "@/utils/token"
import myError from "@/utils/error/myError"

// 引入 模型
const { User } = require("@/db/models")
const router = express.Router()
router.put(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
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
      )
        return res.result(void 0, "修改用户失败哦~", false)

      // 查询
      const findUser = await User.findByPk(id)

      // 判断有无找到用户
      if (!findUser) return res.result(void 0, "没有找到对应用户信息~", false)

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
      if (erroArray.length) return res.result(void 0, erroArray, false)

      // 存在错误信息返回
      if (erroArray.length) return res.result(void 0, erroArray, false)

      // 都通过加入更新
      nickName && findUser.set("nickName", nickName)
      pwd && findUser.set("pwd", pwd)
      // 可能为null
      ;(avatar == null || avatar) && findUser.set("avatar", avatar)
      // 可能为null
      ;(signer == null || signer) && findUser.set("signer", signer)

      // role?.length && findUser.setRoles("role", role)

      // 更新数据库
      const { dataValues } = await findUser.save()

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
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改用户信息失败~", false)
      )
    }
  }
)
export default router

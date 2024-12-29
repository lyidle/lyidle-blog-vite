import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入redis
import { delKey } from "@/utils/redis"
const { User } = require("@/db/models")
const router = express.Router()
router.put(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, account, pwd, email, avater, signer, nickName, role } =
        req.body
      // 都没有时返回没有找到
      if (
        !id ||
        !(
          pwd ||
          email ||
          avater ||
          signer ||
          avater === null ||
          signer === null ||
          nickName ||
          role
        )
      )
        return res.result(void 0, "没有找到对应用户信息~", false)

      // 查询
      const findUser = await User.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      })

      // 判断有无找到用户
      if (!findUser) return res.result(void 0, "没有找到对应用户信息~", false)

      // 提取需要的变量
      const {
        account: userAccount,
        nickName: userNickName,
        email: userEmail,
      } = findUser.dataValues

      // 提取变量 可以直接放入的
      const result: any = {}
      // 整理数据
      result.avater = avater ?? null
      result.signer = signer ?? null
      result.nickName = nickName || userNickName
      // 判断有无值
      if (result.pwd) result.pwd = pwd
      // 判断有无值
      result.role = role ?? ["user"]

      // 错误信息汇总
      const erroArray: string[] = []
      // 判断是否重复
      if (account == userAccount) erroArray.push("账号不能和旧的账号重复~")
      if (email == userEmail) erroArray.push("邮箱不能和旧的邮箱重复~")
      if (erroArray.length) return res.result(void 0, erroArray, false)

      // 判断账号是否重复
      if (account) {
        // 查询是否重名
        const findAccount = await User.findOne({ where: { account } })
        if (findAccount) return res.result(void 0, "账号名重复了~", false)
        // 都通过加入更新
        result.account = account
      }

      // 判断邮箱是否重复
      if (email) {
        // 查询是否重名
        const findEmail = await User.findOne({ where: { email } })
        if (findEmail) return res.result(void 0, "邮箱重复了~", false)
        // 都通过加入更新
        result.email = email
      }
      // 整理完毕更新
      await findUser.update(result)
      // 删除对应id的token
      await delKey(`token:${id}`)
      return res.result(void 0, "修改用户信息成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改用户信息失败~", false)
      )
    }
  }
)
export default router

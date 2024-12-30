import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入redis
import { setkey, delKey } from "@/utils/redis"
// 引入错误函数
import myError from "@/utils/Error"
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

      // 判断是否是用户的文章
      if (req.auth.id !== findUser.dataValues.id) {
        next(new myError("PermissionError"))
        return
      }

      // 提取需要的变量
      const {
        account: userAccount,
        nickName: userNickName,
        email: userEmail,
      } = findUser.dataValues

      // 错误信息汇总
      const erroArray: string[] = []
      // 判断是否重复
      if (account == userAccount) erroArray.push("账号不能和旧的账号重复~")
      if (email == userEmail) erroArray.push("邮箱不能和旧的邮箱重复~")
      if (erroArray.length) return res.result(void 0, erroArray, false)

      // 都通过加入更新
      findUser.set("account", account || userAccount)
      findUser.set("nickName", nickName || userNickName)
      if (pwd) findUser.set("pwd", pwd)
      findUser.set("email", email || userEmail)
      findUser.set("avater", avater || null)
      findUser.set("signer", signer || null)
      findUser.set("role", role || [])
      // 更新数据库
      const { dataValues } = await findUser.save()

      // 改变了pwd 需要重新登录
      if (pwd)
        //删除token
        await delKey(`token:${id}`)
      else {
        // 整理token
        let token: Partial<typeof req.auth> = {}
        token.id = dataValues.id
        token.account = dataValues.account
        token.avater = dataValues.avater
        token.signer = dataValues.signer
        token.email = dataValues.email
        token.nickName = dataValues.nickName
        token.role = dataValues.role
        await setkey(`token:${id}`, token)
      }

      return res.result(void 0, "修改用户信息成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改用户信息失败~", false)
      )
    }
  }
)
export default router

import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { isAdmin, jwtMiddleware } from "@/middleware/auth"
// 引入redis
import { delKey, getKey } from "@/utils/redis"
// 正则判断
import { codeReg } from "@/RegExp/loginOrReg"
// 设置token
import { setToken } from "@/utils/token"
// 处理roles
import { _handlerRoles, ReturnRoles } from "@/utils/db/handlerRoles"
// 重置user的缓存
import { isOwner, resetUserInfo } from "@/utils/redis/resetUserInfo"
// 发送 邮箱 的 api
import update from "@/routes/email/update"

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
    const {
      account: userAccount,
      nickName: userNickName,
      email: userEmail,
      code,
      password,
      confirmPassword,
      avatar,
      signer,
    } = req.body
    // 去除左右空格
    const account = userAccount?.trim()
    const nickName = userNickName?.trim()
    const email = userEmail?.trim()
    // 密码与确认密码不一致
    if (password !== confirmPassword)
      return res.result(void 0, "账号与密码不一致~", false)
    const { reg: _codeReg, msg: codeMsg } = codeReg
    // 验证码不合格
    if (!_codeReg.test(code)) {
      return res.result(void 0, codeMsg, false)
    }
    // 得到 code
    const findRegEmail = await getKey(`updateCode:${email}`)
    // 判断有无找到
    if (findRegEmail === null) {
      return res.result(void 0, "请重新发送验证码~", false)
    }

    const { updateCode: findCode } = findRegEmail

    // 判断验证码是否符合
    if (findCode != code) {
      return res.result(void 0, "验证码不正确~", false)
    }

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

      const user = JSON.parse(JSON.stringify(findUser))

      // 需要 和旧的不一样时 更新
      account && account !== user.account && findUser.set("account", account)
      email && email !== user.email && findUser.set("email", email)
      // 都通过加入更新
      nickName && findUser.set("nickName", nickName)
      password && findUser.set("pwd", password)
      // 可能为 null 的字段
      findUser.set("avatar", avatar || null)
      findUser.set("signer", signer || null)

      // 验证 修改了的 属性字段
      await validateChangedFields(findUser)

      // 更新数据库
      const { dataValues } = await findUser.save({ transaction })

      // 提交事务
      await transaction.commit()

      let token = null
      // 处理 token 字段 的roles
      const tokenSetRoles = ReturnRoles([findUser])
      // 改变了pwd 需要重新登录
      if (password)
        //删除token
        await delKey(`token:${id}`)
      // 没有 修改 密码 则不需要重新登录
      else {
        token = await setToken({ ...dataValues, roles: tokenSetRoles })
      }

      // 删除对应用户信息缓存
      await resetUserInfo([findUser], isOwner(tokenSetRoles))

      // 删除发送的 邮件 code 缓存 查询到的 原邮件
      await delKey(`updateCode:${findUser.dataValues?.email}`)
      return res.result({ token }, "修改用户信息成功~")
    } catch (error) {
      // 如果出现错误，回滚事务
      await transaction.rollback()
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改用户信息失败~", false)
      )
    }
  }
)

// 不需要验证 用户
// 需要验证 登录用户拥有权限 admin
router.put(
  "/manager",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.id
    if (!id) return res.result(void 0, "修改用户信息失败,id是必传项~", false)
    // 开启事务
    const transaction = await db.sequelize.transaction()
    try {
      const { account, email, nickName } = req.body

      // 都没有时返回没有找到
      if (!account && !email && !nickName) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "修改用户失败", false)
      }

      // 查询
      const findUser = await findUserByPk(id as number)

      // 判断有无找到用户
      if (!findUser) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "没有找到对应用户信息~", false)
      }

      // 都通过加入更新
      account && findUser.set("account", account)
      email && findUser.set("email", email)
      nickName && findUser.set("nickName", nickName)

      // 验证 修改了的 属性字段
      await validateChangedFields(findUser)

      // 更新数据库
      const { dataValues } = await findUser.save({ transaction })

      // 提交事务
      await transaction.commit()

      // 处理 token 字段 的roles
      const tokenSetRoles = ReturnRoles([findUser])
      // 没有 修改 密码 则不需要重新登录
      let token = await setToken({ ...dataValues, roles: tokenSetRoles })

      // 删除对应用户信息缓存
      await resetUserInfo([findUser], isOwner(tokenSetRoles))

      return res.result(
        { token, isUser: id === req.auth.id },
        "修改用户信息成功~"
      )
    } catch (error) {
      // 如果出现错误，回滚事务
      await transaction.rollback()
      res.validateAuth(error, next, () =>
        res.result(void 0, "修改用户信息失败~", false)
      )
    }
  }
)

// 邮箱发送接口
router.use(update)
export default router

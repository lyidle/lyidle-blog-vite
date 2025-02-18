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
import { _handlerRoles, ReturnRoles } from "@/utils/db/handlerRoles"

// 引入 模型
const { User, Role } = require("@/db/models")
const db = require("@/db/models")
const router = express.Router()

// 默认的所有者的角色
const default_owner = JSON.parse(process.env.default_owner!)
// 按照 req.auth.id 查找当前的用户
router.put(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    // 开启事务
    const transaction = await db.sequelize.transaction()
    try {
      const { account, pwd, email, avatar, signer, nickName, roles } = req.body

      const id: number | string = req.auth.id

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
        !roles
      ) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "修改用户失败哦~", false)
      }

      // 查询
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
      const _roles = roles?.length && (await setRoles(roles))

      if (_roles?.length) {
        await findUser.setRoles(_roles, { transaction })
      }

      // 提交事务
      await transaction.commit()

      let token = null
      // 处理 token 字段 的roles
      const tokenSetRoles = _roles?.length
        ? _handlerRoles(_roles)
        : ReturnRoles([findUser])

      // 改变了pwd 需要重新登录
      if (pwd)
        //删除token
        await delKey(`token:${id}`)
      // 没有 修改 密码 则不需要重新登录
      else {
        token = await setToken({ ...dataValues, roles: tokenSetRoles })
      }
      // 删除对应用户信息缓存
      await delKey(`userInfo:${id}`)
      await delKey(`userInfo:${userAccount}`)

      // 判断修改的用户是否是owner角色
      const isOwner = tokenSetRoles?.find((item: string) =>
        default_owner?.find((_item: string) => _item.includes(item))
      )

      // 删除owner的缓存
      if (isOwner) await delKey(`userInfo:owner`)

      return res.result(
        { token, isUser: id === req.auth.id, isOwner },
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

// 需要传入 id  没有验证
router.put(
  "/manager",
  [jwtMiddleware],
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
        return res.result(void 0, "修改用户失败哦~", false)
      }

      // 查询
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

      // 判断有无找到用户
      if (!findUser) {
        await transaction.rollback() // 回滚事务
        return res.result(void 0, "没有找到对应用户信息~", false)
      }

      // 都通过加入更新
      account && findUser.set("account", account)
      email && findUser.set("email", email)
      nickName && findUser.set("nickName", nickName)

      // 更新数据库
      const { dataValues } = await findUser.save({ transaction })

      // 提交事务
      await transaction.commit()

      // 处理 token 字段 的roles
      const tokenSetRoles = ReturnRoles([findUser])
      // 没有 修改 密码 则不需要重新登录
      let token = await setToken({ ...dataValues, roles: tokenSetRoles })
      // 删除对应用户信息缓存
      await delKey(`userInfo:${id}`)
      await delKey(`userInfo:${findUser.dataValues.account}`)

      // 判断修改的用户是否是owner角色
      const isOwner = tokenSetRoles?.find((item: string) =>
        default_owner?.find((_item: string) => _item.includes(item))
      )

      // 删除owner的缓存
      if (isOwner) await delKey(`userInfo:owner`)

      return res.result(
        { token, isUser: id === req.auth.id, isOwner },
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
export default router

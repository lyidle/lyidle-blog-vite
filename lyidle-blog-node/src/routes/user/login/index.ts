import express from "express"
import { Op } from "sequelize"
// 设置 token
import { setToken } from "@/utils/token"
const router = express.Router()
// 对比密码
const bcrypt = require("bcryptjs")
// 引入正则判断
import { accountReg, pwdReg } from "@/RegExp/loginOrReg"
// 引入模型
const { User, Role } = require("@/db/models")
// 引入 处理 用户的role 的函数
import { handlerUserRoles } from "@/utils/db/handlerRoles"
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
router.get("/", async (req, res, next) => {
  try {
    const { account: userAccount, password } = req.query
    const account = (userAccount as string).trim()

    // 验证 账号
    if (!accountReg.reg.test(account)) {
      return res.result(void 0, accountReg.msg, false)
    }

    // 验证密码
    if (!pwdReg.reg.test(password as string)) {
      return res.result(void 0, pwdReg.msg, false)
    }

    // 查找用户
    const findUser = await User.findOne({
      where: {
        [Op.or]: {
          account,
          email: account,
        },
      },
      paranoid: false,
      attributes: ["id", "account", "email", "pwd"],
      include: [
        {
          model: Role,
          attributes: ["name"], // 只获取角色名称
          through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
        },
      ],
    })

    // 判断有无找到用户
    if (findUser == null) {
      return res.result(void 0, "没有找到用户~", false)
    }
    // 判断密码是否正确
    if (!bcrypt.compareSync(password, findUser.pwd)) {
      return res.result(void 0, "密码不正确~", false)
    }

    // 调用处理用户权限的 函数
    const user = handlerUserRoles([findUser])

    // 登录验证成功后创建 token
    const token = await setToken(user?.[0])
    // 删除对应用户信息缓存
    await resetUserInfo([findUser])
    return res.result({ token }, "登录成功~")
  } catch (error) {
    res.validateAuth(error, next, () => {
      res.result(void 0, "登录失败~", false)
    })
  }
})
export default router

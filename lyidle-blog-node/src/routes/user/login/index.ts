import express from "express"
import { Op } from "sequelize"
// 设置 token
import { setToken } from "@/utils/token"
const router = express.Router()
// 对比密码
const bcrypt = require("bcryptjs")
// 引入正则判断
const { accountReg, pwdReg } = require("@/routes/user/reg/RegExp")
// 引入模型
const { User } = require("@/db/models")
// 引入 redis 设置缓存
const { delKey } = require("@/utils/redis")
router.get("/", async (req, res, next) => {
  try {
    const { account: userAccount, password } = req.query
    const account = (userAccount as string).trim()
    if (!accountReg.reg.test(account)) {
      return res.result(void 0, accountReg.msg, false)
    }
    if (!pwdReg.reg.test(password)) {
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
      attributes: [
        "id",
        "account",
        "avatar",
        "signer",
        "email",
        "nickName",
        "role",
        "pwd",
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
    // 剔除密码
    delete findUser.dataValues.pwd
    // 登录验证成功后创建 token
    const token = await setToken(findUser.dataValues)
    await delKey(`userInfo:${findUser.dataValues.id}`)
    return res.result({ token }, "登录成功~")
  } catch (error) {
    res.validateAuth(error, next, () => {
      res.result(void 0, "登录失败~", false)
    })
  }
})
export default router

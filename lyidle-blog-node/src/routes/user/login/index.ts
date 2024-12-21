import express from "express"
import { Op } from "sequelize"
const router = express.Router()
// 设置 token
const jwt = require("jsonwebtoken")
// 对比密码
const bcrypt = require("bcryptjs")
// 引入正则判断
const { accountReg, pwdReg } = require("@/routes/user/reg/RegExp")
// 引入模型
const { User } = require("@/db/models")
router.get("/", async (req, res) => {
  const { account, password } = req.query
  if (!accountReg.reg.test(account)) {
    return res.result(void 0, accountReg.msg, false, 400)
  }
  if (!pwdReg.reg.test(password)) {
    return res.result(void 0, pwdReg.msg, false, 400)
  }
  // 查找用户
  const findUser = await User.findOne({
    where: {
      [Op.or]: {
        account,
        email: account,
      },
    },
  })
  // 判断有无找到用户
  if (findUser == null) {
    return res.result(void 0, "没有找到用户~", false, 400)
  }
  // 判断密码是否正确
  if (!bcrypt.compareSync(password, findUser.pwd)) {
    return res.result(void 0, "密码不正确~", false, 400)
  }
  const {
    id,
    account: findAccount,
    nickName,
    email,
    role,
    avater,
    signer,
  } = findUser
  const userInfo: typeof req.auth = {
    id,
    account: findAccount,
    nickName,
    avater,
    signer,
    email,
    role,
  }
  //3.登录验证成功后创建 token
  // jwt.sign(数据, 加密字符串, 配置对象)
  const token = jwt.sign(userInfo, process.env.HASH, {
    algorithm: "HS256",
    expiresIn: process.env.TOKEN_EXPIRE, //单位是 秒
  })
  return res.result({ token }, "登录成功~")
})
export default router

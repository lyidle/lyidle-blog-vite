import express from "express"
import email from "./email"
import type bodyType from "./type"
//导入bcryptjs模块 加密
const bcrypt = require("bcryptjs")
const router = express.Router()
// 正则判断
const { pwdReg, codeReg } = require("@/routes/user/reg/RegExp")
// 引入模型
const { RegEmail, User } = require("@/db/models")
// 注册接口
router.post("/", async (req, res, next) => {
  const { body } = req
  const { account, email, code, password, confirmPassword } = body as bodyType
  // 判断密码是否合格
  if (!pwdReg.reg.test(password)) {
    res.send(res.result(void 0, pwdReg.msg, false))
    return
  }
  // 账号与密码不一致
  if (password !== confirmPassword) {
    res.send(res.result(void 0, "账号与密码不一致~", false))
    return
  }
  const { reg, msg } = codeReg
  // 验证码不合格
  if (!reg.test(code)) {
    res.send(res.result(void 0, msg, false))
    return
  }
  try {
    const findRegEmail = await RegEmail.findOne({
      where: { email },
    })
    // 判断有无找到
    if (findRegEmail === null) {
      res.send(res.result(void 0, "请重新发送验证码~", false))
      return
    }
    const { code: findCode, expiresAt } = findRegEmail.dataValues
    // 判断验证码是否过期
    if (expiresAt < new Date()) {
      res.send(res.result(void 0, "验证码过期~", false))
      return
    }
    // 判断验证码是否符合
    if (findCode != code) {
      res.send(res.result(void 0, "验证码不正确~", false))
      return
    }
    // 判断有无重复用户
    const findUser = await User.findOne({ where: { email } })
    if (findUser !== null) {
      res.send(res.result(void 0, "请勿重复注册~", false))
      return
    }
    const user = {
      account,
      pwd: bcrypt.hashSync(password, 10),
      email,
      avater: "",
      signer: "",
    }
    // 通过校验插入用户 插入用户组 sequelize模型设置了验证器
    await User.create(user)
  } catch (err: any) {
    if (err.name === "SequelizeValidationError") {
      return next(err)
    }
    res.send(res.result(err, "注册失败~", false))
    return
  }
  res.send(res.result(void 0, "注册成功~"))
})
// 邮箱发送接口
router.use(email)
export default router

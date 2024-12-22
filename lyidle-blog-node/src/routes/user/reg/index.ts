import express from "express"
import email from "./email"
import type bodyType from "./type"
import { Op } from "sequelize"
//导入bcryptjs模块 加密
const bcrypt = require("bcryptjs")
const router = express.Router()
// 正则判断
const { pwdReg, codeReg } = require("@/routes/user/reg/RegExp")
// 引入模型
const { Email, User } = require("@/db/models")
// 注册接口
router.post("/", async (req, res, next) => {
  const { body } = req
  const { account, nickName, email, code, password, confirmPassword } =
    body as bodyType
  // 判断密码是否合格
  if (!pwdReg.reg.test(password)) {
    return res.result(void 0, pwdReg.msg, false, 400)
  }
  // 账号与密码不一致
  if (password !== confirmPassword) {
    return res.result(void 0, "账号与密码不一致~", false, 400)
  }
  const { reg, msg } = codeReg
  // 验证码不合格
  if (!reg.test(code)) {
    return res.result(void 0, msg, false, 400)
  }
  try {
    const findRegEmail = await Email.findOne({
      where: { email },
    })
    // 判断有无找到
    if (findRegEmail === null) {
      return res.result(void 0, "请重新发送验证码~", false, 400)
    }
    const { regCode: findCode, expiresAt } = findRegEmail.dataValues
    // 判断验证码是否过期
    if (expiresAt < new Date()) {
      return res.result(void 0, "验证码过期~", false, 400)
    }
    // 判断验证码是否符合
    if (findCode != code) {
      return res.result(void 0, "验证码不正确~", false, 400)
    }
    // 判断有无重复用户
    const findUser = await User.findOne({
      where: { [Op.or]: { email, account } },
    })
    if (findUser !== null) {
      return res.result(void 0, "请勿重复注册~", false, 400)
    }
    const user = {
      account,
      nickName,
      pwd: bcrypt.hashSync(password, 10),
      email,
      role: ["user"],
    }
    // 通过校验插入用户 插入用户组 sequelize模型设置了验证器
    await User.create(user)
  } catch (err: any) {
    return res.validateAuth(err, next, () =>
      res.result(void 0, "注册失败~", false, 400)
    )
  }
  return res.result(void 0, "注册成功~")
})
// 邮箱发送接口
router.use(email)
export default router

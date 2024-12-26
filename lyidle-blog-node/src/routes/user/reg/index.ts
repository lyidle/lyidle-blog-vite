import express from "express"
import email from "@/routes/email/reg"
const router = express.Router()
// 正则判断
const { codeReg } = require("@/routes/user/reg/RegExp")
// 引入模型
const { Email, User } = require("@/db/models")
// 注册接口
router.post("/", async (req, res, next) => {
  const { account, nickName, email, code, password, confirmPassword } = req.body
  // 密码与确认密码不一致
  if (password !== confirmPassword)
    return res.result(void 0, "账号与密码不一致~", false, 400)
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
    const { regCode: findCode, regExpiresAt } = findRegEmail.dataValues
    // 判断验证码是否过期
    if (regExpiresAt < new Date()) {
      return res.result(void 0, "验证码过期~", false, 400)
    }
    // 判断验证码是否符合
    if (findCode != code) {
      return res.result(void 0, "验证码不正确~", false, 400)
    }
    const user = {
      account,
      nickName,
      pwd: password,
      email,
      role: JSON.stringify(["user"]),
    }
    // 通过校验插入用户 插入用户组 sequelize模型设置了验证器
    await User.create(user)
    return res.result(void 0, "注册成功~")
  } catch (err: any) {
    return res.validateAuth(err, next, () =>
      res.result(void 0, "注册失败~", false, 400)
    )
  }
})
// 邮箱发送接口
router.use(email)
export default router

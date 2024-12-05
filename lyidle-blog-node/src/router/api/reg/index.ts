import express from "express"
import email from "@/router/api/reg/email"
import bodyType from "./type"
const regEmail = require("@/mysql/table/regEmail")
const router = express.Router()
// 正则
// 账号大于等于3位 不能重复
// 密码
const passReg =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@,_.])[a-zA-Z0-9$@,_.]{6,12}$/
// 邮箱
const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
// 验证码正则
const codeReg = /^[0-9]{6}$/
// 注册接口
router.post("/reg", async (req, res) => {
  const { body } = req
  const { account, email, code, password, confirmPassword } = body as bodyType
  if (account.length < 3) {
    res.send(res.locals.result(void 0, "账号长度最少要是三位哦~", 401))
    return
  }
  if (!passReg.test(password)) {
    res.send(
      res.locals.result(
        void 0,
        "密码需要必须包含数字、字母小写与大写，和特殊字符($@,_.)中的一个~",
        402
      )
    )
    return
  }
  if (!emailReg.test(email)) {
    res.send(res.locals.result(void 0, "邮箱格式不正确哦~", 403))
    return
  }
  if (!codeReg.test(code)) {
    res.send(res.locals.result(void 0, "验证码格式不正确哦~", 404))
    return
  }
  if (password !== confirmPassword) {
    res.send(res.locals.result(void 0, "账号与密码不一致~", 405))
    return
  }
  const result = await regEmail.create({ email: "9125@qq.com", code: 21 })
  console.log(result)
  res.send(res.locals.result(void 0, "注册成功~"))
})
// 邮箱发送接口
router.use(email)
export default router

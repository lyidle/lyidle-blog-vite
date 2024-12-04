import express from "express"
const router = express.Router()
// 发件人配置
const nodemailer = require("nodemailer")
const MAIL_HOST = "smtp.office365.com"
const MAIL_PORT = "587"
const MAIL_USER = "reg@lyidle.cn"
const MAIL_PWD = "n)vC^=vzaQh8P[$(c=7C&t,hyG2u3NV"
const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PWD,
  },
})
// 发送函数
const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: MAIL_USER, // 发送者
    to, // 接收者
    subject, // 主题
    html, // HTML内容
  }
  return await transporter.sendMail(mailOptions)
}

// 邮箱发送接口
router.post("/email", async (req, res) => {
  const { email } = req.body
  if (email) console.log(email)
  // 生成6位随机验证码
  const code = Math.random().toString().slice(2, 8)
  // 构建HTML模板
  const html = `
  <p>你好！</p>
  <p>您正在注册社区账号</p>
  <p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
  <p>***该验证码5分钟内有效***</p>
`
  try {
    // 发送邮件
    await sendMail(email, "验证码", html)
    // 存储验证码（使用Redis）
    const emailCodeKey = `email:${email}`
    console.log(emailCodeKey)
    res.send(res.locals.result({}, "发送邮箱验证码成功~"))
  } catch (error) {
    res.send(res.locals.result(error, "发送邮箱验证码失败~", 401))
  }
})
export default router

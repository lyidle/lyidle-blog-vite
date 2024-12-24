import express from "express"
const ms = require("ms")
const router = express.Router()
const nodemailer = require("nodemailer")
// 引入模型
const { Email } = require("@/db/models")

// 引入moment
import moment from "@/utils/moment"
// 邮箱的配置
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: JSON.parse(process.env.secure ? process.env.secure : "false"),
  requireTLS: JSON.parse(
    process.env.requireTLS ? process.env.requireTLS : "true"
  ),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PWD,
  },
})
// 发送函数
const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: process.env.MAIL_USER, // 发送者
    to, // 接收者
    subject, // 主题
    html, // HTML内容
  }
  return await transporter.sendMail(mailOptions)
}
// 构建HTML模板
const template = (email: string, code: string, createTime: string) => {
  return `
  <!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="UTF-8" />
    <title>激活邮件</title>
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
      }

      body {
        background-color: #ececec;
      }

      .container {
        width: 800px;
        margin: 50px auto;
      }

      .header {
        height: 80px;
        background-color: #3baff2;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        padding-left: 30px;
      }

      .header h2 {
        padding-top: 25px;
        color: white;
      }

      .content {
        background-color: #fff;
        padding-left: 30px;
        padding-bottom: 30px;
        border-bottom: 1px solid #ccc;
      }

      .content h2 {
        padding-top: 20px;
        padding-bottom: 20px;
      }

      .content p {
        padding-top: 10px;
      }

      .footer {
        background-color: #fff;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        padding: 20px;
      }

      .footer p {
        color: #747474;
        padding-top: 10px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h2>欢迎加入${process.env.MAIL_PLAT}~</h2>
      </div>
      <div class="content">
        <h2>亲爱的用户您好</h2>
        <p>
          您的邮箱：<b><span>${email}</span></b>
        </p>
        <p>
          您的激活码：<b><span>${code}</span></b>，5分钟内有效。
        </p>
        <p>
          您注册时的日期：<b><span>${createTime}</span></b>
        </p>
        <p>当您在使用本网站时，务必要遵守法律法规</p>
      </div>
      <div class="footer">
        <p>此为系统邮件，如无必要，请勿回复</p>
        <p>请保管好您的信息，避免被他人盗用</p>
      </div>
    </div>
  </body>
</html>
`
}
// map用于暂存 销毁函数的定时器
const map = new Map()
// regCode过期时间
const codeExpire = ms(process.env.RegCode_EXPIRE)

// 邮箱发送接口
router.post("/email", async (req, res, next) => {
  const { email } = req.body
  // 生成6位随机验证码
  const code = Math.random().toString().slice(2, 8).padEnd(6, "0")
  // 生成邮件模板
  const genHtml = template(email, code, moment(new Date(), "LLL"))
  // 插入的数据
  const data = {
    email,
    regCode: code,
    expiresAt: new Date(Date.now() + codeExpire),
  }
  try {
    // 查找是否存在
    const findEmail = await Email.findOne({ where: { email } })
    if (findEmail !== null) {
      // 存在更新
      await Email.update(data, { where: { email } })
    } else {
      // 不存在则创建
      await Email.create(data)
    }
    // 五分钟销毁
    let timer = setTimeout(async () => {
      // 查找对应邮箱
      const result = await Email.findOne({ where: { email } })
      // 更新regCode为null
      if (result !== null) result.update({ regCode: null })
      map.delete(email)
    }, codeExpire)
    // 如果有上一次的 则 取消上一次的定时器
    const time = map.get(email)
    if (time) {
      clearTimeout(time)
      map.delete(email)
    }
    // 使用Map存储 键为email 值为定时器
    map.set(email, timer)
    // 发送邮件
    if (JSON.parse(process.env.isPro ? process.env.isPro : ""))
      await sendMail(email, "验证码", genHtml)
    return res.result(data, "发送邮箱验证码成功~")
  } catch (err: any) {
    return res.validateAuth(err, next, () =>
      res.result(void 0, "发送邮件失败~", false)
    )
  }
})
export default router

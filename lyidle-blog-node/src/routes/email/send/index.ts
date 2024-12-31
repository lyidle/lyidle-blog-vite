// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 redis
const { setKey, getKey } = require("@/utils/redis")
const nodemailer = require("nodemailer")
// 引入时间转换
const ms = require("ms")
// 引入dayjs
import dayjs from "dayjs"
// 邮箱的配置
const transporter = nodemailer.createTransport({
  host: process.env.email_host,
  port: process.env.email_port,
  secure: JSON.parse(
    process.env.email_secure ? process.env.email_secure : "false"
  ),
  requireTLS: JSON.parse(
    process.env.email_requireTLS ? process.env.email_requireTLS : "true"
  ),
  auth: {
    user: process.env.email_user,
    pass: process.env.email_pwd,
  },
})
// 发送函数
const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: process.env.email_user, // 发送者
    to, // 接收者
    subject, // 主题
    html, // HTML内容
  }
  return await transporter.sendMail(mailOptions)
}
// code过期时间
const codeExpire = ms(process.env.code_expire)

// 判断是否是生成环境
const is_production = JSON.parse(process.env.is_production!)

// 邮箱发送接口
export default (
  route: string,
  setData: "regCode" | "forgetCode",
  template: (email: string, code: string, createTime?: string) => string
) => {
  return (
    route as string,
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body
      // redis 插入的键值
      const cacheKey = `${setData}:${email}`
      // 获取redis的数据
      let result = await getKey(cacheKey)
      if (result) {
        if (JSON.parse(is_production ? is_production : ""))
          return res.result(
            void 0,
            `请${Math.floor(codeExpire / 1000)}秒后重新发送验证码~`,
            false
          )
        else
          return res.result(
            result,
            `请${Math.floor(codeExpire / 1000)}秒后重新发送验证码~`,
            false
          )
      }
      // 生成6位随机验证码
      const code = Math.random().toString().slice(2, 8).padEnd(6, "0")
      // 生成邮件模板
      const genHtml = template(
        email,
        code,
        dayjs().format("YYYY-MM-DD HH:mm:ss")
      )
      // redis插入的数据
      const cacheValue: {
        [property: string]: any
      } = {
        email,
      }
      // 更具传递的参数生成 是 发送的什么邮件
      cacheValue[setData] = code
      // 如果redis没有 则设置
      result = await setKey(cacheKey, cacheValue, codeExpire)
      try {
        // 发送邮件
        if (JSON.parse(is_production ? is_production : ""))
          await sendMail(email, "验证码", genHtml)
      } catch (err: any) {
        return res.validateAuth(err, next, () =>
          res.result(void 0, "发送邮件失败~", false)
        )
      }
      if (JSON.parse(is_production ? is_production : ""))
        return res.result(void 0, "发送邮件成功~")
      else return res.result(result, "发送邮件成功~")
    }
  )
}

// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入dayjs
import dayjs from "dayjs"
// 引入 redis
import { setKey, getKey } from "@/utils/redis"
const nodemailer = require("nodemailer")
// 引入时间转换
const ms = require("ms")
// 引入验证
import { emailReg } from "@/RegExp/loginOrReg"
import { formatMilliseconds } from "@/utils/times/timeFormatter"
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
// 判断是否发送邮件
const email_send = JSON.parse(process.env.email_send!)

// 邮箱发送接口
export default (
  route: string,
  setData: "regCode" | "forgetCode" | "updateCode",
  template: (email: string, code: string, createTime?: string) => string
) => {
  return (
    route as string,
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body
      // 判断格式
      if (!emailReg.reg.test(email))
        return res.result(void 0, emailReg.msg, false)

      // redis 插入的键值
      const cacheKey = `${setData}:${email}`
      // 获取redis的数据
      let result = await getKey(cacheKey)
      // 有缓存 返回
      if (result)
        return res.result(
          (!is_production && { ...result, expire: codeExpire }) || void 0,
          `请${formatMilliseconds(codeExpire)}后重新发送验证码~`,
          false
        )

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
      // 默认保存的键
      result = cacheValue
      // 是生产环境
      if (is_production) {
        try {
          // 判断是否发送邮件
          if (email_send) {
            // 发送邮件
            await sendMail(email, "验证码", genHtml)
            // 设置缓存
            result = await setKey(cacheKey, cacheValue, codeExpire)
          }
        } catch (err: any) {
          return res.validateAuth(err, next, () =>
            res.result(void 0, "发送邮件失败~", false)
          )
        }
      }
      // 不是 生产 环境
      else {
        // 设置缓存
        result = await setKey(cacheKey, cacheValue, codeExpire)
      }

      return res.result(
        // 不是生产环境
        (!is_production && { ...result, expire: codeExpire }) || {
          // 是生产环境
          expire: codeExpire,
        },
        "发送邮件成功~"
      )
    }
  )
}

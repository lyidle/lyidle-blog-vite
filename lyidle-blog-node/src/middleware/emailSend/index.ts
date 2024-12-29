// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 redis
import { setkey, getKey } from "@/utils/redis"
const ms = require("ms")
const nodemailer = require("nodemailer")
// 引入模型
const { Email } = require("@/db/models")

// 引入moment
import moment from "@/utils/moment"
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
// map用于暂存 销毁函数的定时器
const map = new Map()
// code过期时间
const codeExpire = ms(process.env.code_expire)

// 邮箱发送接口
export default (
  route: string,
  setData: "regCode" | "forgetCode",
  setDataValue: "regExpiresAt" | "forgetExpiresAt",
  template: (email: string, code: string, createTime?: string) => string
) => {
  return (
    route as string,
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body
      // 生成6位随机验证码
      const code = Math.random().toString().slice(2, 8).padEnd(6, "0")
      // 生成邮件模板
      const genHtml = template(email, code, moment(new Date(), "LLL"))
      // 插入的数据
      const data: {
        [property: string]: any
      } = {
        email,
      }
      // 更具传递的参数生成 是 发送的什么邮件
      data[setDataValue] = new Date(Date.now() + codeExpire)
      data[setData] = code
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
        // 构建 map存储的键
        const mapKey: { [property: string]: any } = { email }
        mapKey[setData] = setData
        // 五分钟销毁
        let timer = setTimeout(async () => {
          // 查找对应邮箱
          const result = await Email.findOne({ where: { email } })
          // 更新 对应的列为null
          const updateData: { [property: string]: any } = {}
          updateData[setData] = null
          if (result !== null) result.update(updateData)
          map.delete(mapKey)
        }, codeExpire)
        // 如果有上一次的 则 取消上一次的定时器
        const time = map.get(mapKey)
        if (time) {
          clearTimeout(time)
          map.delete(mapKey)
        }
        // 使用Map存储 键为email 值为定时器
        map.set(mapKey, timer)
        // 发送邮件
        if (JSON.parse(process.env.isPro ? process.env.isPro : ""))
          await sendMail(email, "验证码", genHtml)
        return res.result(data, "发送邮箱验证码成功~")
      } catch (err: any) {
        return res.validateAuth(err, next, () =>
          res.result(void 0, "发送邮件失败~", false)
        )
      }
    }
  )
}

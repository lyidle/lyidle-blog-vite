import { Router } from "express"
// 引入 发送邮箱的函数
import sendEmail from "../send"
const dayjs = require("dayjs")
// 引入时间转换
const ms = require("ms")
// code过期时间
const codeExpire = ms(process.env.code_expire)
// 反馈的邮箱
const email_feedback = process.env.email_feedback
// 计算过期时间
const expireTime = (createTime: string) =>
  dayjs(createTime).add(codeExpire, "millisecond").format("YYYY-MM-DD HH:mm:ss")
// 构建HTML模板
const template = (email: string, code: string, createTime: string) => {
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>账号找回验证</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .container {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
            font-size: 24px;
          }
          .info {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 4px;
          }
          .label {
            font-weight: bold;
            color: #2c3e50;
            display: inline-block;
            width: 80px;
          }
          .code {
            background-color: #f0f0f0;
            padding: 15px;
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            margin: 20px 0;
            border-radius: 4px;
            color: #e74c3c;
            letter-spacing: 2px;
          }
          .note {
            background-color: #f8f4e5;
            padding: 12px;
            border-left: 4px solid #f39c12;
            margin: 25px 0;
            font-size: 14px;
            border-radius: 0 4px 4px 0;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #7f8c8d;
            text-align: center;
            padding-top: 15px;
            border-top: 1px solid #eee;
          }
          .highlight {
            color: #e74c3c;
            font-weight: bold;
          }
          .action-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>账号找回验证</h1>

          <div class="info">
            <span class="label">关联邮箱：</span>
            <span class="highlight">${email}</span>
          </div>

          <div class="info">
            <span class="label">申请时间：</span>
            <span>${createTime}</span>
          </div>
          
          <p>您正在申请找回${
            process.env.email_reg_stage
          }的账号，请使用以下验证码完成身份验证：</p>
          
          <div class="code">${code}</div>
          
          <p>此验证码将在 <span class="highlight">${expireTime(
            createTime!
          )}</span> 过期</p>

          <div class="note">
            <p>安全提示：</p>
            <ul>
              <li>反馈邮箱：${email_feedback}</li>
              <li>此验证码仅用于本次账号找回验证</li>
              <li>请不要将验证码透露给任何人</li>
              <li>如非本人操作，请立即联系客服</li>
            </ul>
          </div>

          <div class="footer">
            <p>© ${process.env.email_reg_stage} 账号安全中心</p>
            <p>系统自动发送，请勿直接回复</p>
          </div>
        </div>
      </body>
    </html>
  `
}
const router = Router()
router.use(sendEmail("/email", "forgetCode", template))
export default router

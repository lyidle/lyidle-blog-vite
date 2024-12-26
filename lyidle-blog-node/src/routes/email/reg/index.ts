import { Router } from "express"
// 引入 发送邮箱的函数
import sendEmail from "@/middleware/emailSend"
// 构建HTML模板
const template = (email: string, code: string, createTime?: string) => {
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
const router = Router()
router.use(sendEmail("/email", "regCode", "regExpiresAt", template))
export default router

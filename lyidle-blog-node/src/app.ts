import express from "express"
import type { Response, Request, NextFunction } from "express"
//在文件外部扩展不知道怎么弄
declare global {
  namespace Express {
    interface Request {
      auth: {
        account: string
        email: string
        role: string
      }
    }
    interface Response {
      result: (
        data: any,
        message: string,
        status?: boolean
      ) => {
        status: boolean
        data: object | void
        message: string
      }
    }
  }
}
require("dotenv").config()
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const app = express()

// 端口
const PORT = process.env.BACK_PORT || 3000

// 中间件 扩展request.result 用来定义返回类型
const RequestExtension = require("@/middleware/RequestExtension")

// 插件
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(RequestExtension)

// 路由
const api = require("@/routes")
app.get("/", (req, res) => {
  res.send("hello")
})
app.use("/api", api)
app.use((err: any, req: any, res: any, next: any) => {
  // console.log(err)
  // 数据库插入校验
  if (err.name === "SequelizeValidationError") {
    res.send(
      res.result(
        void 0,
        err.errors.length === 1
          ? err.errors[0].message
          : err.errors.map((item: any) => item.message),
        false
      )
    )
  }
  //token解析失败导致的错误
  if (err.name === "UnauthorizedError") {
    return res.status(401).send(res.result(void 0, "无效的token~", false))
  }
})
app.listen(PORT, () => console.log(`Api is running on port ${PORT}.`))

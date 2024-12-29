import express from "express"
import type { Request, Response, NextFunction } from "express"
// 导入环境变量
require("dotenv").config()

const app = express()
// api端口
const api_port = process.env.api_port
// web端口
const web_port = process.env.web_port

// 处理跨域
const cors = require("cors")
const corsOptions = {
  origin: ["http://localhost:5173", `http://127.0.0.1:${web_port}`],
}
app.use(cors(corsOptions))

// 插件
const logger = require("morgan")
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// 全局中间件
// 扩展request.result 用来定义返回类型
const RequestExtension = require("@/middleware/RequestExtension")
app.use(RequestExtension)

// 导入路由
const api = require("@/routes")

app.get("/", (req, res) => {
  res.send("hello")
})
// 挂载路由
app.use("/api", api)

// 全局错误中间件
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // 数据库插入校验
  if (err.name === "SequelizeValidationError")
    return res.result(
      void 0,
      // err.errors.length === 1
      //   ? err.errors[0].message
      //   :
      err.errors.map((item: any) => item.message),
      false,
      400
    )
  //token解析失败导致的错误
  if (err.name === "UnauthorizedError")
    return res.result(void 0, "TOKEN过期~", false, 401)
  if (err.name === "PermissionError")
    return res.result(void 0, "没有权限访问~", false, 403)
  // 打印其他错误
  console.log(err)
})

app.listen(api_port, () => console.log(`Api is running on port ${api_port}.`))

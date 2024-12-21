import express from "express"
// 导入环境变量
require("dotenv").config()
// @ts-ignore
if (JSON.parse(process.env.alias)) {
  const a = require("module-alias/register")
  console.log(a)
}
const cookieParser = require("cookie-parser")
const logger = require("morgan")
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

// 中间件 扩展request.result 用来定义返回类型
const RequestExtension = require("@/middleware/RequestExtension")

// 插件
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(RequestExtension)

// 导入路由
const api = require("@/routes")

app.get("/", (req, res) => {
  res.send("hello")
})
// 挂载路由
app.use("/api", api)

// 导入挂载错误中间件
const errMiddleWare = require("@/middleware/globalError")
app.use(errMiddleWare)

app.listen(api_port, () => console.log(`Api is running on port ${api_port}.`))

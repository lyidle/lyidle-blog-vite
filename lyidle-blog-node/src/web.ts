import express from "express"
import { resolve } from "path"
// 导入环境变量
require("dotenv").config()
const app = express()

// web端口
const web_port = process.env.web_port

// 日志
// const logger = require("morgan")
// app.use(logger("dev"))

// 处理history
const history = require("connect-history-api-fallback")
app.use(history())
// 静态资源
app.use(express.static(resolve(__dirname, "./static/dist")))

app.listen(web_port, () => console.log(`Web is running on port ${web_port}.`))

import express from "express"
import { resolve } from "path"

const port = 3598
const app = express()

// const logger = require("morgan")
// app.use(logger("dev"))

// 端口
const PORT = process.env.BACK_PORT || 3000

// 处理history
const history = require("connect-history-api-fallback")
app.use(history())
// 静态资源
app.use(express.static(resolve(__dirname, "./static")))
// 反向代理
const { createProxyMiddleware } = require("http-proxy-middleware")
app.use(
  "/api",
  createProxyMiddleware({
    changeOrigin: true,
    target: `http://127.0.0.1:${PORT}/api`,
  })
)
app.listen(port, () => console.log(`Web is running on port ${port}.`))

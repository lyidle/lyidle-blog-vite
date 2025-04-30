import express from "express"
import { resolve } from "path"
// 导入环境变量
require("dotenv").config()
const app = express()

// web端口
const web_port = parseInt(process.env.web_port as string) as number

// 日志
// const logger = require("morgan")
// app.use(logger("dev"))

// 处理history
const history = require("connect-history-api-fallback")
app.use(history())
// 静态资源
app.use(express.static(resolve(__dirname, "./static/dist")))

// 得到 环境变量
const api_prefix = process.env.api_prefix
const is_production = JSON.parse(process.env.is_production as string) as boolean
const TARGET_SERVER = "http://blog-api.lyidle.cn"
if (is_production) {
  // 反向代理
  const { createProxyMiddleware } = require("http-proxy-middleware")
  // 静态资源反代
  app.use(
    `${api_prefix}/assets`,
    createProxyMiddleware({
      changeOrigin: true,
      target: TARGET_SERVER,
      pathRewrite: {
        // 重写路径规则
        [`^${api_prefix}/assets`]: "", // 把 /api/assets 重写为 /
      },
      // 其他代理配置...
      onProxyReq(proxyReq, req, res) {
        // 可以在请求发出前做一些处理
        console.log(
          `Proxying request: ${req.path} -> ${TARGET_SERVER}   ${proxyReq.path}`
        )
      },
    })
  )
  app.listen(web_port, "0.0.0.0", () =>
    console.log(`Web is running on port ${web_port}.`)
  )
} else
  app.listen(web_port, "127.0.0.1", () =>
    console.log(`Web is running on port ${web_port}.`)
  )

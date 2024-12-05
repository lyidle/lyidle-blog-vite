import express from "express"
// 导入api路由
import api from "@router/api"
// 引入基础配置
import { EXPRESS } from "@/config.json"
const initHash = require("@/init/hash")
// 初始化生成hash
initHash()
// 端口
const { port } = EXPRESS
const app = express()
// 初始化数据库 创建表
require("@/mysql/init")
// 解析body json
app.use(express.json())
// 解析body urlencoded
app.use(express.urlencoded({ extended: false }))
// 引入中间件
const middleWare = require("@/init/middleWare")
// 应用中间件
app.use(middleWare)
// app.get("/", (req, res) => {
//   res.send("Hello, TypeScript and Express!")
// })
app.use("/api", api)
app.use((err: any, req: any, res: any, next: any) => {
  console.log(err)
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})

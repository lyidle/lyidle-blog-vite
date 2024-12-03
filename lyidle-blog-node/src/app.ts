import express from "express"
import { MyResponse } from "@/@types/express"
// 导入api路由
import api from "@router/api"
const app = express()
const PORT = 3000
app.use((req, res: MyResponse, next) => {
  // 配置通用的返回格式
  res.locals.result = (data, message) => {
    return {
      status: 200,
      data: data,
      message: message,
    }
  }
  next()
})
app.get("/", (req, res) => {
  res.send("Hello, TypeScript and Express!")
})
app.use("/api", api)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

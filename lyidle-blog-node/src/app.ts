import express from "express" // 导入api路由
import api from "@router/api"
import type { MyResponse } from "@/@types/express"
// 引入基础配置
import config from "@/config.json"
import fs from "fs"
// 引入nnoid加盐
const { EXPRESS } = config
const PORT = EXPRESS.port
// // 查看有没有加盐
// if (!EXPRESS.hash) {
// const hash = nanoid
// console.log(nanoid)
//   // EXPRESS.hash = hash
//   // console.log(config)
//   // fs.writeFile()
// }

const app = express()
app.use((req, res: MyResponse, next) => {
  // 配置通用的返回格式
  res.locals.result = (data, message, status = 200) => {
    return {
      status: status,
      data: data,
      message: message,
    }
  }
  next()
})
// 解析body json
app.use(express.json())
// 解析body urlencoded
app.use(express.urlencoded({ extended: false }))
app.get("/", (req, res) => {
  res.send("Hello, TypeScript and Express!")
})
app.use("/api", api)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

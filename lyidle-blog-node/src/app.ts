import express from "express"
import type { Request, Response, NextFunction } from "express"
// 引入初始化
import initialEnvironment from "@/utils/initial"
import { resolve } from "path"
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
// 挂载 静态资源目录

// 静态资源
app.use(express.static(resolve(__dirname, "./assets")))

// 导入路由
const api = require("@/routes")

;(async () => await initialEnvironment())()

app.get("/", (req, res) => {
  res.send("hello")
})

const api_prefix = process.env.api_prefix || "/api"

// 挂载路由
app.use(api_prefix, api)

// 全局错误中间件
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // 数据库插入校验
  if (err.name === "SequelizeValidationError") {
    return res.result(
      void 0,
      // err.errors.length === 1
      //   ? err.errors[0].message
      //   :
      err.errors.map((item: any) => item.message),
      false
    )
  }
  // 数据库 unique 错误
  if (err.name === "SequelizeUniqueConstraintError") {
    const uniqueError = err
    // 获取模型名称
    const modelName = uniqueError.errors[0].instance.constructor.name
    // 获取违反唯一性约束的字段
    const uniqueFields = uniqueError.errors.map((err: any) => err.path)
    // 处理 各个模型的 错误
    switch (modelName) {
      case "BannerImg":
        res.result(void 0, "背景的路径名字不能重复哦~", false, 400)
        break
      case "Menu":
        res.result(void 0, "菜单的名字不能重复哦~", false, 400)
        break
      case "Permission":
        res.result(void 0, "权限的名字不能重复哦~", false, 400)
        break
      case "PermissionGroup":
        res.result(void 0, "权限组的名字不能重复哦~", false, 400)
        break
      case "Role":
        res.result(void 0, "角色的名字不能重复哦~", false, 400)
        break
      case "Setting":
        res.result(void 0, "设置的名字不能重复哦~", false, 400)
        break
      case "User":
        // 用户的 拥有 unique 字段的属性 有两个
        const result: string[] = []
        if (uniqueFields.includes("account"))
          result.push("用户的名字不能重复哦~")
        if (uniqueFields.includes("email")) result.push("用户的邮箱不能重复哦~")
        res.result(void 0, result, false, 400)
        break
    }
    return
  }

  //token解析失败导致的错误
  if (err.name === "UnauthorizedError")
    return res.result(void 0, "TOKEN过期~", false, 401)
  // 其他 错误
  if ((err.name = "otherError"))
    return res.result(void 0, err.message, false, 400)
  // 打印其他错误
  console.log(err)
})

app.listen(api_port, () => console.log(`Api is running on port ${api_port}.`))

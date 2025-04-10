import express from "express"
import type { Request, Response, NextFunction } from "express"
// 引入初始化
import initialEnvironment from "@/utils/initial"
import { resolve } from "path"
import { Op } from "sequelize"
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
  origin: ["http://localhost:5173", `http://localhost:${web_port}`],
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

// 引入 redis
// import { clear } from "./utils/redis"
;(async () => {
  // await clear()
  await initialEnvironment()
})()

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
        res.result(void 0, "背景的路径名字不能重复", false)
        break
      case "Menu":
        res.result(void 0, "菜单的名字不能重复", false)
        break
      case "Permission":
        res.result(void 0, "权限的名字不能重复", false)
        break
      case "PermissionGroup":
        res.result(void 0, "权限组的名字不能重复", false)
        break
      case "Role":
        res.result(void 0, "角色的名字不能重复", false)
        break
      case "Setting":
        res.result(void 0, "设置的名字不能重复", false)
        break
      case "LikeDislike":
        // 获取违反唯一性约束的字段
        const LikeDislikeErrors: string[] = []
        if (uniqueFields.includes("userId"))
          LikeDislikeErrors.push("用户ID不能重复")
        if (uniqueFields.includes("targetType"))
          LikeDislikeErrors.push("目标类型不能重复")
        if (uniqueFields.includes("commentId"))
          LikeDislikeErrors.push("评论ID不能重复")

        // 根据联合唯一索引的逻辑，返回更具体的错误信息
        if (LikeDislikeErrors.length > 0) {
          res.result(
            void 0,
            `用户对同一目标只能有一条记录：${LikeDislikeErrors.join(", ")}`,
            false
          )
        } else {
          res.result(void 0, "用户对同一目标只能有一条记录", false)
        }
        break
      case "User":
        // 用户的 拥有 unique 字段的属性 有两个
        const result: string[] = []
        if (uniqueFields.includes("account")) result.push("用户的名字不能重复")
        if (uniqueFields.includes("email")) result.push("用户的邮箱不能重复")
        res.result(void 0, result, false)
        break
    }
    return
  }

  //token解析失败导致的错误
  if (err.name === "UnauthorizedError")
    return res.result(void 0, "TOKEN过期~", false, 401)
  // 其他 错误
  if ((err.name = "otherError")) return res.result(void 0, err.message, false)
  // 打印其他错误
  console.log(err)
})

// 定时任务
const schedule = require("node-schedule")

const { User, Article, Menu } = require("@/db/models")

// 引入时间转换
const ms = require("ms")
//  软删除用户的时间
const delete_user_expire = ms(process.env.delete_user_expire)
//  软删除文章的时间
const delete_article_expire = ms(process.env.delete_article_expire)
//  软删除菜单的时间
const delete_menu_expire = ms(process.env.delete_menu_expire)

// 删除 用户 的回调
const handlerUserDel = async (num) => {
  if (num && typeof +num === "number" && !Number.isNaN(+num)) {
    const counts = await User.destroy({
      force: true,
      paranoid: false,
      where: {
        isBin: {
          // 查询软删除且超过 过期的用户
          [Op.not]: null, // 确保只查询已软删除的记录
          [Op.lt]: new Date(Date.now() - +num),
        },
      },
    })
    console.log(`定时清除过期用户成功个数:${counts}`)
  } else {
    console.error("delete_user_expire 的环境变量需要是符合ms库的字符")
  }
}

// 删除 文章 的回调
const handlerArticleDel = async (num) => {
  if (num && typeof +num === "number" && !Number.isNaN(+num)) {
    const counts = await Article.destroy({
      force: true,
      paranoid: false,
      where: {
        isBin: {
          // 查询软删除且超过 过期的用户
          [Op.not]: null, // 确保只查询已软删除的记录
          [Op.lt]: new Date(Date.now() - +num),
        },
      },
    })
    console.log(`定时清除过期文章成功个数:${counts}`)
  } else {
    console.error("delete_article_expire 的环境变量需要是符合ms库的字符")
  }
}

// 删除 文章 的回调
const handlerMenuDel = async (num) => {
  if (num && typeof +num === "number" && !Number.isNaN(+num)) {
    const counts = await Menu.destroy({
      force: true,
      paranoid: false,
      where: {
        isBin: {
          // 查询软删除且超过 过期的用户
          [Op.not]: null, // 确保只查询已软删除的记录
          [Op.lt]: new Date(Date.now() - +num),
        },
      },
    })
    console.log(`定时清除过期菜单成功个数:${counts}`)
  } else {
    console.error("delete_menu_expire 的环境变量需要是符合ms库的字符")
  }
}

// 每天凌晨 4:00 执行
schedule.scheduleJob("0 4 * * *", async function () {
  await Promise.allSettled([
    // 删除过期的用户
    handlerUserDel(delete_user_expire),
    // 删除过期的文章
    handlerArticleDel(delete_article_expire),
    // 删除过期的菜单
    handlerMenuDel(delete_menu_expire),
  ])
  console.log(
    `每天凌晨 4:00 执行，清除数据完成时间：${new Date().toLocaleString()}`
  )
})

app.listen(api_port, () => console.log(`Api is running on port ${api_port}.`))

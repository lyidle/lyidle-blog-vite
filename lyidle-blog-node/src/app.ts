import express from "express"
import type { Request, Response, NextFunction } from "express"
// 引入初始化
import initialEnvironment from "@/utils/initial"
import { join, resolve } from "path"
import { Op } from "sequelize"
import { existsSync, rm } from "fs"
import { getDirectoryTree } from "./utils/io/getDirectoryTree"
import { unlink } from "fs/promises"
import { getKey, getKeys } from "./utils/redis"
// 导入环境变量
require("dotenv").config()

const app = express()
// api端口
const api_port = parseInt(process.env.api_port as string)
// web端口
const web_port = process.env.web_port

const is_production = JSON.parse(process.env.is_production as string)

// 处理跨域
const cors = require("cors")
const corsOptions = {
  origin: is_production
    ? [
        // 服务器
        `https://lyidle.cn`,
      ]
    : [
        // 本地
        // vite
        "http://localhost:5173",
        // web
        `http://127.0.0.1:${web_port}`,
      ],
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
// import { delKeys } from "./utils/redis"
;(async () => {
  // await delKeys("")
  await initialEnvironment()
})()
app.get("/", (req, res) => {
  res.send("hello，这是一个接口文件")
})

const api_prefix = process.env.api_prefix || "/api"

// 挂载路由
app.use(api_prefix, api)

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
    try {
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
        individualHooks: true,
      })
      console.log(`定时清除过期用户成功个数:${counts}`)
    } catch (error) {
      console.error("定时清除过期用户失败:", error)
    }
  } else {
    console.error("delete_user_expire 的环境变量需要是符合ms库的字符")
  }
}

// 删除 文章 的回调
const handlerArticleDel = async (num) => {
  if (num && typeof +num === "number" && !Number.isNaN(+num)) {
    try {
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
        individualHooks: true,
      })
      console.log(`定时清除过期文章成功个数:${counts}`)
    } catch (error) {
      console.error("定时清除过期文章失败:", error)
    }
  } else {
    console.error("delete_article_expire 的环境变量需要是符合ms库的字符")
  }
}

// 删除 菜单 的回调
const handlerMenuDel = async (num) => {
  if (num && typeof +num === "number" && !Number.isNaN(+num)) {
    try {
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
        individualHooks: true,
      })
      console.log(`定时清除过期菜单成功个数:${counts}`)
    } catch (error) {
      console.error("定时清除过期菜单失败:", error)
    }
  } else {
    console.error("delete_menu_expire 的环境变量需要是符合ms库的字符")
  }
}

// 处理 无效的 图片
const handlerTempImg = async () => {
  // 删除临时文件
  const deletePath = join(__dirname, "./assets/images/temp")
  if (existsSync(deletePath))
    rm(deletePath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error(`删除临时图片出错`, err)
        return
      }
    })
}
// 处理 多个 头像的问题
const handlerDuplicateAvatar = async () => {
  // 得到 目录数结构
  const dirPath = join(__dirname, "./assets/images")
  if (!existsSync(dirPath)) return
  // 处理头像多个的问题
  const tree = getDirectoryTree(dirPath)
  const users = tree?.children
  // 没有用户文件夹
  if (!users?.length) return

  for (const user of users) {
    // 首先检查是否是目录
    if (user.type !== "directory") return
    // 判断是否是用户文件夹
    if (Number.isNaN(+user.name)) return
    // 得到 用户id
    let userId = user.name
    // 判断是否是头像
    for (const avatar of user.children) {
      if (avatar.name !== "avatar" || avatar.type !== "directory") return
      // 判断是否有两个头像
      if (avatar.children.length <= 1) return
      // 得到 有两个头像的 用户
      // 头像多余了
      const avatars = avatar.children

      const findUser = await User.findByPk(userId, {
        attributes: ["avatar"],
      })
      const userAvatar = join(findUser.avatar)
      for (const avatar of avatars) {
        if (avatar.type === "file") {
          const curAvatar = join(
            api_prefix,
            `/assets/images/${userId}/avatar`,
            avatar.name
          )
          // 找到不相等的
          if (userAvatar === curAvatar) return
          // 删除头像
          unlink(avatar.path).catch((err) =>
            console.error(`删除多余的头像失败,path:${avatar.path}`, err)
          )
        }
      }
    }
  }
}

// 处理 没有成功创建文章或评论与消息产生的 冗余图片
const handlerTempImgByPermanent = async () => {
  try {
    // 定义清理任务
    const cleanUpTasks = [
      cleanDirectory("message:imgs:", "文章图片"),
      cleanDirectory("comment:imgs:", "评论图片"),
      cleanDirectory("message:imgs:", "消息图片"),
    ]

    // 执行所有清理任务
    const results = await Promise.allSettled(cleanUpTasks)

    // 汇总结果
    const summary = {
      total: results.length,
      succeeded: results.filter((r) => r.status === "fulfilled").length,
      failed: results.filter((r) => r.status === "rejected").length,
      errors: results
        .filter((r) => r.status === "rejected")
        .map((r) => (r as PromiseRejectedResult).reason),
    }

    console.log("清理完成:", summary)
    return summary
  } catch (error) {
    console.error("清理过程中发生全局错误:", error)
    throw error
  }
}

// 辅助函数：清理指定目录
const cleanDirectory = async (prefix: string, description: string) => {
  try {
    console.log(`开始清理 ${description} (${prefix})`)
    const keys = await getKeys(prefix, { raw: true })

    const deleteResults = await Promise.allSettled(
      keys.map(async (key) => {
        try {
          const path = await getKey(key)
          if (existsSync(path)) {
            // 将 rm 的回调转换为 Promise
            await new Promise<void>((resolve, reject) => {
              rm(path, { recursive: true, force: true }, (err) => {
                if (err) {
                  console.error(`删除文件失败: ${path}`, err)
                  reject(err)
                } else {
                  console.log(`成功删除文件: ${path}`)
                  resolve()
                }
              })
            })
          }
          return { key, success: true }
        } catch (error) {
          console.error(`处理文件 ${key} 时出错:`, error)
          return { key, success: false, error }
        }
      })
    )

    const successCount = deleteResults.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length
    const failCount = deleteResults.length - successCount

    console.log(
      `${description} 清理完成: 成功 ${successCount} 个, 失败 ${failCount} 个`
    )
    return {
      description,
      prefix,
      total: keys.length,
      successCount,
      failCount,
      details: deleteResults,
    }
  } catch (error) {
    console.error(`清理 ${description} 时出错:`, error)
    throw error
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
    // 处理 无效的 图片
    handlerTempImg(),
    // 处理 没有成功创建文章或评论与消息产生的 冗余图片
    handlerTempImgByPermanent(),
  ])
  console.log(
    `每天凌晨 4:00 执行，清除数据完成时间：${new Date().toLocaleString()}`
  )
})
// 每月15日凌晨4:00执行
schedule.scheduleJob("0 4 15 * *", async function () {
  await Promise.allSettled([
    // 处理 多个 头像的问题
    handlerDuplicateAvatar(),
  ])
  console.log(
    `每月15日凌晨4:00执行，清除数据完成时间：${new Date().toLocaleString()}`
  )
})

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

  // 模型英文名到中文名的映射
  const modelNameMap: Record<string, string> = {
    Article: "文章",
    ArticleBookmark: "文章收藏",
    ArticleCount: "文章计数",
    ArticleTime: "文章时间",
    BannerImg: "横幅图片",
    Comment: "评论",
    Filter: "敏感词",
    FilterType: "敏感词分类",
    Follow: "关注",
    LikeDislike: "点赞/点踩",
    Mention: "@提及",
    Menu: "菜单",
    Message: "消息",
    Permission: "权限",
    PermissionGroup: "权限组",
    Report: "举报",
    Role: "角色",
    Setting: "设置",
    Share: "分享",
    SystemMessage: "系统消息",
    User: "用户",
    Visitor: "访客",

    // 外键约束的 table
    FilterTypes: "敏感词的分类",
  }
  // 数据库 unique 错误
  if (err.name === "SequelizeUniqueConstraintError") {
    const uniqueError = err

    // 获取模型名称
    const modelName =
      uniqueError.errors[0].instance?.constructor?.name || "未知模型"

    // 获取模型中文名，如果不存在则返回英文名
    const modelNameCN = modelNameMap[modelName] || modelName
    // 获取违反唯一性约束的字段
    const uniqueFields = uniqueError.errors.map(
      (err: any) => `模型${modelNameCN}的字段 ${err.path} 是唯一的`
    )
    return res.result(void 0, uniqueFields, false)
  }
  // 数据库约束错误
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.result(
      void 0,
      `操作失败：外键约束错误 ${
        modelNameMap[err.table] || err.table || "未知"
      }表的字段: ${err.fields?.map((item) => item)} 出错，待插入的值为： ${
        err.value
      }`,
      false
    )
  }
  //token解析失败导致的错误
  if (err.name === "UnauthorizedError")
    return res.result(void 0, "TOKEN过期~", false, 401)
  // 其他 错误
  if ((err.name = "otherError")) return res.result(void 0, err.message, false)
  // 打印其他错误
  console.log(err)
})

if (is_production)
  app.listen(api_port, "0.0.0.0", () =>
    console.log(`Api is running on port ${api_port}.`)
  )
else
  app.listen(api_port, "127.0.0.1", () =>
    console.log(`Api is running on port ${api_port}.`)
  )

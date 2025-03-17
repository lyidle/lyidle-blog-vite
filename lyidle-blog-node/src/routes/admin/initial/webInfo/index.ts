import express from "express"
import { Request, Response, NextFunction } from "express"
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
import { setKey, getKey } from "@/utils/redis"
const { User, Article, Visitor } = require("@/db/models")

const router = express.Router()

router.post(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 并行执行所有初始化任务
      const results = await Promise.allSettled([
        // 初始化 创站时间
        (async () => {
          const webCreatedAt = await getKey("webCreatedAt")
          if (!webCreatedAt) await setKey("webCreatedAt", new Date())
        })(),

        // 初始化 访客数
        (async () => {
          const touristCounts = await Visitor.count()
          await setKey("touristCounts", touristCounts)
        })(),

        // 初始化 用户数
        (async () => {
          const userCount = await User.count()
          await setKey("userCounts", userCount)
        })(),

        // 初始化 网站最后更新时间
        (async () => {
          const { dataValues: FindOneArticle } = await Article.findOne({
            paranoid: false,
            attributes: ["updatedAt"],
            order: [
              ["updatedAt", "desc"],
              ["id", "desc"],
            ],
            limit: 1,
          })
          await setKey("webUpdatedAt", FindOneArticle?.updatedAt || new Date())
        })(),

        // 初始化 文章总数
        (async () => {
          const articleCount = await Article.count()
          await setKey("webTotalPages", articleCount)
        })(),

        // 初始化 网站文章总字数
        (async () => {
          const Articles = await Article.findAll({ attributes: ["length"] })
          let length = 0
          JSON.parse(JSON.stringify(Articles)).forEach((item: any) => {
            length += item.length
          })
          await setKey("totalWords", length)
        })(),
      ])

      // 检查是否有任务失败
      const failedTasks = results.filter(
        (result) => result.status === "rejected"
      )
      if (failedTasks.length > 0) {
        console.error("部分初始化任务失败:", failedTasks)
      }

      // 返回成功响应
      res.result(void 0, "初始化小站咨询信息成功~")
    } catch (error) {
      // 捕获未处理的异常
      console.error("初始化小站咨询信息失败:", error)

      // 返回错误响应
      res.validateAuth(error, next, () =>
        res.result(void 0, "初始化小站咨询信息失败~", false)
      )
    }
  }
)

export default router

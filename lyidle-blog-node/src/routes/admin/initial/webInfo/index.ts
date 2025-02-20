/* 初始化小站咨询 */
import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
const router = express.Router()
// 引入redis 设置缓存
import { setKey, getKey, delKey } from "@/utils/redis"
// 引入模型
const { User, Article, Visitor } = require("@/db/models")
router.get(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 获取缓存
      const initialWebInfo = await getKey("initialWebInfo")
      if (initialWebInfo)
        return res.result(void 0, "正在初始化小站咨询中,请稍后重试~", false)
      // 没有缓存 初始化
      await setKey("initialWebInfo", true)

      // 初始化 创站时间
      const webCreatedAt = await getKey("webCreatedAt")
      if (!webCreatedAt) await setKey("webCreatedAt", new Date())

      // 初始化 访客数
      const touristCounts = await Visitor.count()
      await setKey("touristCounts", touristCounts)

      // 初始化 用户数
      const userCount = await User.count()
      await setKey("userCounts", userCount)

      // 初始化 文章信息

      // 网站最后更新时间
      const webUpdatedAt = await getKey("webUpdatedAt")
      if (!webUpdatedAt) {
        const { dataValues: FindOneArticle } = await Article.findOne({
          attributes: ["updatedAt"],
          order: [["updatedAt", "desc"], [["id", "desc"]]],
          limit: 1,
        })
        await setKey("webUpdatedAt", FindOneArticle?.updatedAt || new Date())
      }

      // 初始化 文章总数
      const articleCount = await Article.count()
      await setKey("webTotalPages", articleCount)

      // 初始化 网站文章总字数
      const Articles = await Article.findAll({ attributes: ["length"] })
      let length = 0
      JSON.parse(JSON.stringify(Articles)).forEach((item: any) => {
        length += item.length
      })
      await setKey("totalWords", length)
      res.result(void 0, "初始化小站咨询信息成功~")
      // 初始化 结束
      await delKey("initialWebInfo")
    } catch (error) {
      // 初始化 失败
      await delKey("initialWebInfo")
      res.validateAuth(error, next, () =>
        res.result(void 0, "初始化小站咨询信息失败~", false)
      )
    }
  }
)
// 挂载路由
export default router

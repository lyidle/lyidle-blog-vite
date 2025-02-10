import express from "express"
const router = express.Router()
// 引入模型
const { Article, Visitor, User, Setting } = require("@/db/models")
// 引入 redis 设置缓存
import { setKey, getKey, delKey } from "@/utils/redis"
router.get("/", async (req, res, next) => {
  try {
    // 获取创建站的时间
    const webCreatedAt = await getKey("webCreatedAt")

    // 获取到访客数量
    let touristCounts = +(await getKey("touristCounts"))
    if (!touristCounts) {
      // 查询游客量
      touristCounts = await Visitor.count()
      await setKey("touristCounts", touristCounts)
    }

    // 查询用户数量
    const webUserCounts = +(await getKey("userCounts"))

    // 总访问量
    const webTotalPersonCounts = webUserCounts + touristCounts

    // 网页总数
    const webTotalPages = +(await getKey("webTotalPages"))

    // 最后更新时间
    const webUpdatedAt = await getKey("webUpdatedAt")

    // 获取字数
    let webTotalWords = await getKey("webTotalWords")
    if (!webTotalWords) {
      // 查询所有文章 统计字数
      const totalWordsData = await Article.findAll({
        where: { isBin: "" },
        order: [
          ["updatedAt", "desc"],
          ["id", "desc"],
        ],
        attributes: ["length"],
      })

      let totalCounts = 0
      for (const data of JSON.parse(JSON.stringify(totalWordsData))) {
        totalCounts += data.length
      }
      webTotalWords = await setKey("webTotalWords", totalCounts)
    }

    return res.result(
      {
        // 网站文章总数
        webTotalPages,
        // 网站用户数
        webUserCounts,
        // 网站访客数
        touristCounts,
        // 网站总人数
        webTotalPersonCounts,
        // 网站创建时间
        webCreatedAt,
        // 文章最后更新时间
        webUpdatedAt,
        // Words统计
        webTotalWords,
      },
      "查询网站咨询成功~"
    )
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询网站咨询失败~", false)
    )
  }
})
export default router

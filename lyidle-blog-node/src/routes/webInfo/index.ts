import express from "express"
// 引入统计访问量
import visitor from "./visitor"
const router = express.Router()
// 引入模型
const { Article, Visitor, User, UserInfo, Setting } = require("@/db/models")
router.get("/", async (req, res, next) => {
  try {
    // 统计访客信息
    await visitor(req, next)

    // 查询用户数量
    const { count: webUserCounts, rows } = await User.findAndCountAll({
      where: { status: 0 },
      include: [
        {
          model: UserInfo,
          attributes: { exclude: ["UserId"] },
        },
      ],
      attributes: ["id"],
    })

    // 查询最后一篇文章更新时间
    const { count: webTotalPages, rows: findUpdated } =
      await Article.findAndCountAll({
        where: { status: 0 },
        order: [
          ["updatedAt", "desc"],
          ["id", "desc"],
        ],
        attributes: ["updatedAt"],
      })

    // 处理 最后更新时间
    const webUpdatedAt =
      JSON.stringify(findUpdated) === "[]"
        ? null
        : findUpdated[findUpdated.length - 1].dataValues.updatedAt

    // 查询建站时间
    const findCreated = await Setting.findOne({
      where: { name: "createWedbAt" },
      attributes: ["content"],
    })
    // 处理创站时间
    const webCreatedAt = findCreated?.dataValues?.content ?? null

    // 查询游客量
    const touristCounts = await Visitor.count()

    // 总访问量
    const webTotalPersonCounts = webUserCounts + touristCounts

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
        totalWordsData: rows,
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

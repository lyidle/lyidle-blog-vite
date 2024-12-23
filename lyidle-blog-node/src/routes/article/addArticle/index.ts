import express from "express"
const router = express.Router()
// 引入模型
const { Article, User, UserInfo } = require("@/db/models")
router.post("/", async (req, res, next) => {
  const {
    title,
    content,
    author,
    category,
    tags,
    carousel,
    desc,
    poster,
    length,
  } = req.body
  const data: any = {
    title,
    content,
    author,
    category,
    tags,
    carousel: Number(carousel),
    desc,
    poster,
    length,
  }
  let result
  try {
    console.log(!author)
    if (!author) return res.result(void 0, "文章作者不能为空哦~", false)
    const findUser = await User.findOne({
      where: { account: author },
      attributes: ["id"],
    })
    if (findUser == null) {
      return res.result(void 0, "当前作者不存在~", false)
    }
    const userId = findUser.id
    data.userId = userId
    // 创建文章
    result = await Article.create(data)
    // 查找用户信息
    const findUserInfo = await UserInfo.findOne({
      where: { userId: userId },
    })
    // 没有就创建 用户信息
    if (!findUserInfo) {
      await UserInfo.create({
        articleCounts: 1,
        tipArrays: [...new Set(tags)],
        categoryArrays: [category],
        userId: userId,
        totalWords: Number(length),
      })
    }
    // 有则更新
    if (findUserInfo) {
      const { articleCounts, tipArrays, categoryArrays, totalWords } =
        findUserInfo.dataValues
      await findUserInfo.update({
        articleCounts: articleCounts + 1,
        tipArrays: [...new Set([...tags, ...tipArrays])],
        categoryArrays: [...new Set([category, ...categoryArrays])],
        totalWords: Number(length) + Number(totalWords),
      })
    }
  } catch (err) {
    return res.validateAuth(err, next, () =>
      res.result(err, "增加文章失败~", false)
    )
  }
  return res.result(void 0, "增加文章成功~")
})
export default router

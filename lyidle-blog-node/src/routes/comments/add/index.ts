import express from "express"
// 引入 模型
const { Comment, User, Article, Setting } = require("@/db/models")

const router = express.Router()

// 添加评论
router.post("/", async (req, res, next) => {
  const {
    articleId,
    settingId,
    content,
    fromId,
    parentId,
    userProvince,
    userAgent,
  } = req.body

  if (!content) return res.result(void 0, "添加评论时，content是必传项", false)

  // 判断是否冲突
  if (articleId && settingId)
    return res.result(
      void 0,
      "添加评论时，articleId和settingId不能同时存在",
      false
    )

  // 判断是否冲突
  if (!articleId && !settingId)
    return res.result(
      void 0,
      "添加评论时，articleId和settingId至少需要有一个",
      false
    )

  // 有 articleId 检查 articleId 文章 是否存在
  if (articleId) {
    // 检查 文章 是否存在
    const article = await Article.findByPk(articleId)
    if (!article) return res.result(void 0, "文章不存在", false)
  }
  // 有 settingId 检查 settingId 文章 是否存在
  if (settingId) {
    // 检查 文章 是否存在
    const setting = await Setting.findByPk(settingId)
    if (!setting) return res.result(void 0, "设置项的文章不存在", false)
  }

  const userId = req.auth.id
  try {
    // 处理 文章的 逻辑
    // 创建评论
    await Comment.create({
      userId,
      articleId: articleId || null,
      settingId: settingId || null,
      content,
      fromId: fromId || null, // 顶级评论，fromId 为 null
      parentId: parentId || null, // 顶级评论，parentId 为 null
    })
    try {
      // 更新 用户
      await User.update(
        { userProvince: userProvince || null, userAgent: userAgent || null },
        { where: { id: userId } }
      )
    } catch (error) {}
    res.result(void 0, "评论添加成功")
    return
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "评论添加失败", false)
    )
  }
})
export default router

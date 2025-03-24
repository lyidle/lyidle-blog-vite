import express from "express"
// 引入 文章 和 评论 的 接口
import articles from "./articles"
import comments from "./comments"
import settings from "./settings"
const router = express.Router()
// 挂载接口
router.use("/articles", articles)
router.use("/comments", comments)
router.use("/settings", settings)
export default router

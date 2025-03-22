import express from "express"
// 引入 模型
const { Comment, User } = require("@/db/models")
// 引入 按照 分页器获取 评论
import pagination from "./pagination"
// 引入 回复 相关的 评论
import replies from "./replies"

const router = express.Router()

// 挂载 api
router.use("/pagination", pagination)
router.use("/replies", replies)
export default router

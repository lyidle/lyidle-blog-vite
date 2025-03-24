import express from "express"
// 引入 模型
const { Comment, User } = require("@/db/models")
// 引入 api
import pagination from "./pagination"
const router = express.Router()

router.use("/", pagination)

export default router

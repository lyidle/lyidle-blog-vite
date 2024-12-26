import express from "express"
// 引入 更新 user中间件
import update from "@/middleware/user/update"
const router = express.Router()
router.use(update("/"))
export default router

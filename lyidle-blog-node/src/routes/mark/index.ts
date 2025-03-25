import express from "express"
// 引入 路由
import article from "./article"

const router = express.Router()

// 挂载 路由
router.use("/article", article)
export default router

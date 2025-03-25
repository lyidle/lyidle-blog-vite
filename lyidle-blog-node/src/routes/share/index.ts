import express from "express"
// 引入 路由
import article from "./article"
import setting from "./setting"

const router = express.Router()

// 挂载 路由
router.use("/article", article)
router.use("/setting", setting)
export default router

import express from "express"
// 引入 路由
import get from "./get"
import add from "./add"

const router = express.Router()

// 挂载 路由
router.use("/get", get)
router.use("/add", add)

export default router

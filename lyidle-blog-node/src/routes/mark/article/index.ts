import express from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入 路由
import get from "./get"
import toggle from "./toggle"

const router = express.Router()

// 挂载 路由
router.use("/get", get)
router.use("/toggle", jwtMiddleware, toggle)
export default router

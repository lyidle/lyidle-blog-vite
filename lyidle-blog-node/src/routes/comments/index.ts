import express from "express"
import add from "./add"
import get from "./get"
import { jwtMiddleware } from "@/middleware/auth"
const router = express.Router()
// 增加的 接口需要登录
router.use("/", jwtMiddleware, add)
router.use("/", get)
export default router

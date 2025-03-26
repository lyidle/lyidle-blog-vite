import express from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入 路由
import add from "./add"
import get from "./get"
import del from "./del"

const router = express.Router()

// 挂载路由
router.use("/add", jwtMiddleware, add)
router.use("/get", get)
router.use("/del", jwtMiddleware, del)
export default router

import express from "express"
// 引入 点赞和点菜的 接口
import like from "./like"
import dislike from "./dislike"
import get from "./get"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
const router = express.Router()
// 挂载接口
router.use("/like", jwtMiddleware, like)
router.use("/dislike", jwtMiddleware, dislike)
router.use("/get", get)
export default router

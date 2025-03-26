import express from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入 路由
import follower from "./follower"
import following from "./following"
import isFollowed from "./isFollowed"

const router = express.Router()

// 挂载路由
router.use("/follower", follower)
router.use("/following", following)
router.use("/isFollowed", isFollowed)

export default router

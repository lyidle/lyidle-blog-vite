import express from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 /admin/bannerImg
// 获取
import getBannerImg from "./get"
// 更新
import putBannerImg from "./put"
// 改变 状态
import bin from "./bin"
const router = express.Router()
router.use("/", getBannerImg)
router.use("/", [jwtMiddleware, isAdmin], putBannerImg)
router.use("/", [jwtMiddleware, isAdmin], bin)
export default router

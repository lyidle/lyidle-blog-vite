import express from "express"
// 引入权限判断
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 导入 api/announce
import getAnnounce from "./get"
import setAnnounce from "./set"
const router = express.Router()
router.use("/", getAnnounce)
router.use("/", [jwtMiddleware, isAdmin], setAnnounce)
export default router

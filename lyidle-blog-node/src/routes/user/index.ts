import express from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入 api/user/reg
import reg from "@/routes/user/reg"
// 引入 api/user/login
import login from "@/routes/user/login"
// 引入 api/user/login
import logout from "@/routes/user/logout"
// 引入 api/user/userinfo
import userinfo from "@/routes/user/userinfo"
// 引入 api/user/search
import search from "@/routes/user/search"
// 引入 api/user/admin
import admin from "@/routes/user/admin"
// 引入 api/user/follow
import follow from "@/routes/user/follow"
// 引入 api/user/msg
import msg from "./msg"
// 引入 api/user/report
import report from "./report"

const router = express.Router()
// 挂载路由
router.use("/reg", reg)
router.use("/login", login)
router.use("/logout", logout)
router.use("/userinfo", userinfo)
router.use("/search", search)
router.use("/admin", admin)
router.use("/follow", follow)
router.use("/msg", jwtMiddleware, msg)
router.use("/report", jwtMiddleware, report)
export default router

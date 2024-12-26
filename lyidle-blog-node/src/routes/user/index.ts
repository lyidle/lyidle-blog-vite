import express from "express"
// 引入 api/user/reg
import reg from "@/routes/user/reg"
// 引入 api/user/login
import login from "@/routes/user/login"
// 引入 api/user/userinfo
import userinfo from "@/routes/user/userinfo"
// 引入 api/user/search
import search from "@/routes/user/search"
// 引入 api/user/admin
import admin from "@/routes/user/admin"
const router = express.Router()
// 挂载路由
router.use("/reg", reg)
router.use("/login", login)
router.use("/userinfo", userinfo)
router.use("/search", search)
router.use("/admin", admin)
export default router

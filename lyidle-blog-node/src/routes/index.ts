import express from "express"
// 引入 api/admin 路由
import admin from "@/routes/admin"
// 引入 api/user 路由
import user from "@/routes/user"
// 引入 api/article
import article from "@/routes/article"
// 引入 api/webInfo
import webInfo from "@/routes/webInfo"
// 引入 api/visitor
import visitor from "@/routes/visitor"
// 引入 api/upload
import upload from "./upload"
// 引入权限判断
import { jwtMiddleware, isAdmin, isTourist } from "@/middleware/auth"
const router = express.Router()
// root api
router.get("/", (req, res) => {
  res.send("Here is the api~")
})
// 挂载路由 全部加上 访客验证 除了 visitor 的get
router.use("/admin", isTourist, admin)
router.use("/user", isTourist, user)
router.use("/visitor", visitor)
router.use("/article", isTourist, article)
router.use("/webInfo", isTourist, webInfo)
router.use("/upload", isTourist, jwtMiddleware, upload)
module.exports = router

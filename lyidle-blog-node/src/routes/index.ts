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
// 引入 api/comments
import comments from "./comments"
// 引入 api/likeOrdislike
import likeOrdislike from "./likeOrdislike"
// 引入 api/mark
import mark from "./mark"
// 引入 api/share
import share from "./share"
// 引入权限判断
import { jwtMiddleware, isTourist } from "@/middleware/auth"
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
router.use("/upload", [jwtMiddleware, isTourist], upload)
router.use("/comments", isTourist, comments)
router.use("/likeOrdislike", isTourist, likeOrdislike)
router.use("/mark", isTourist, mark)
router.use("/share", isTourist, share)
module.exports = router

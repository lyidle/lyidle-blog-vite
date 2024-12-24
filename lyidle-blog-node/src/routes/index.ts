import express from "express"
// 引入 api/admin 路由
import admin from "@/routes/admin"
// 引入 api/user 路由
import user from "@/routes/user"
// 引入 api/article
import article from "@/routes/article"
// 引入 api/webInfo
import webInfo from "@/routes/webInfo"
const router = express.Router()
// root api
router.get("/", (req, res) => {
  res.send("Here is the api~")
})
// 挂载路由
router.use("/admin", admin)
router.use("/user", user)
router.use("/article", article)
router.use("/webInfo", webInfo)
module.exports = router

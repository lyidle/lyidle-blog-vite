import express from "express"
// 引入 api/admin 路由
import admin from "@/routes/admin"
// 引入 api/reg
import reg from "@/routes/user/reg"
// 引入 api/login
import login from "@/routes/user/login"
// 引入 api/menuList
import menuList from "@/routes/user/menuList"
// 引入 api/announce
import announce from "@/routes/user/announce"
const router = express.Router()
// root api
router.get("/", (req, res) => {
  res.send("13134")
})
// 挂载路由
router.use("/admin", admin)
router.use("/reg", reg)
router.use("/login", login)
router.use("/menuList", menuList)
router.use("/announce", announce)
module.exports = router

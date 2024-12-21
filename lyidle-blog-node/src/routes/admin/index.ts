import express from "express"
import jwt from "@/middleware/auth"
// 引入 api/admin/menuList
import menuList from "@/routes/admin/menuList"
// 引入 api/admin/announce
import announce from "@/routes/admin/announce"
// 引入 句子路由
import sentence from "@/routes/admin/sentence"
const router = express.Router()
router.get("/test", jwt, (req, res) => {
  console.log(req.auth)
  res.send("admin send")
})
// 挂载路由
router.use("/announce", announce)
router.use("/menuList", menuList)
router.use("/", sentence)
export default router

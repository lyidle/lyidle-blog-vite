import express from "express"
// 引入 api/admin/menuList
import menuList from "@/routes/admin/menuList"
// 引入 api/admin/announce
import announce from "@/routes/admin/announce"
// 引入 api/admin/poetry
import sentence from "@/routes/admin/sentence"
const router = express.Router()
// 挂载路由
router.use("/announce", announce)
router.use("/menuList", menuList)
router.use("/", sentence)
export default router

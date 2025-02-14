import express from "express"
// 引入 api/admin/menuList
import menuList from "@/routes/admin/menuList"
// 引入 api/admin/permission
import permission from "@/routes/admin/permission"
// 引入 api/admin/announce
import announce from "@/routes/admin/announce"
// 引入 api/admin/poetry
import sentence from "@/routes/admin/sentence"
// 引入 api/settings
import settings from "@/routes/admin/setting"
// 引入 api/initial
import initials from "@/routes/admin/initial"
const router = express.Router()
// 挂载路由
router.use("/announce", announce)
router.use("/menuList", menuList)
router.use("/permission", permission)
router.use("/settings", settings)
router.use("/initial", initials)
router.use(sentence)
export default router

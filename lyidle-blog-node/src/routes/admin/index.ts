import express from "express"
// 引入 api/admin/menuList
import menuList from "@/routes/admin/menuList"
// 引入 api/admin/bannerImg
import bannerImg from "@/routes/admin/bannerImg"
// 引入 api/admin/permissionGroup
import permissionGroup from "@/routes/admin/permissionGroup"
// 引入 api/admin/role
import role from "@/routes/admin/role"
// 引入 api/admin/announce
import announce from "@/routes/admin/announce"
// 引入 api/admin/poetry
import sentence from "@/routes/admin/sentence"
// 引入 api/admin/settings
import settings from "@/routes/admin/setting"
// 引入 api/admin/initial
import initials from "@/routes/admin/initial"
const router = express.Router()
// 挂载路由
router.use("/announce", announce)
router.use("/role", role)
router.use("/menuList", menuList)
router.use("/bannerImg", bannerImg)
router.use("/permissionGroup", permissionGroup)
router.use("/settings", settings)
router.use("/initial", initials)
router.use(sentence)
export default router

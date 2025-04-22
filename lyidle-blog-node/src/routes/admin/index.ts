import express from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
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
// 引入 api/admin/recycle
import recycle from "@/routes/admin/recycle"
// 引入 api/admin/report
import report from "@/routes/admin/report"
// 引入 api/admin/sysMsg
import sysMsg from "@/routes/admin/sysMsg"
// 引入 api/admin/filter
import filter from "@/routes/admin/filter"
// 引入 api/admin/msg
import msg from "@/routes/admin/msg"
// 引入 api/admin/comment
import comment from "@/routes/admin/comment"
// 引入 api/admin/site
import site from "@/routes/admin/site"

const router = express.Router()
// 挂载路由
router.use("/announce", announce)
router.use("/role", [jwtMiddleware, isAdmin], role)
router.use("/menuList", menuList)
router.use("/bannerImg", bannerImg)
router.use("/permissionGroup", [jwtMiddleware, isAdmin], permissionGroup)
router.use("/settings", settings)
router.use("/initial", [jwtMiddleware, isAdmin], initials)
router.use("/", sentence)
router.use("/recycle", [jwtMiddleware, isAdmin], recycle)
router.use("/report", [jwtMiddleware, isAdmin], report)
router.use("/sysMsg", [jwtMiddleware, isAdmin], sysMsg)
router.use("/filter", [jwtMiddleware, isAdmin], filter)
router.use("/msg", [jwtMiddleware, isAdmin], msg)
router.use("/comment", [jwtMiddleware, isAdmin], comment)
router.use("/site", site)
export default router

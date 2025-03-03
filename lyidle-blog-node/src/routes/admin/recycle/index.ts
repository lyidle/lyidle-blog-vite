import express from "express"
// 引入 api
import user from "./user"
import role from "./role"
import group from "./group"
import permission from "./permission"
import menu from "./menu"

const router = express.Router()
// 挂载路由
router.use("/user", user)
router.use("/role", role)
router.use("/group", group)
router.use("/permission", permission)
router.use("/menu", menu)
export default router

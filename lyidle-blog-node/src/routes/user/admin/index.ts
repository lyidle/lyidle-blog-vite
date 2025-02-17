import express from "express"
// 引入 删除用户api
import deleted from "@/routes/user/admin/delete"
import update from "@/routes/user/admin/update"
import create from "@/routes/user/admin/create"
const router = express.Router()
// 挂载api
router.use(deleted)
router.use("/update", update)
router.use("/create", create)
export default router

import express from "express"
// 引入 删除用户api
import deleted from "@/routes/user/admin/delete"
import update from "@/routes/user/admin/update"
const router = express.Router()
router.use(deleted)
router.use("/update", update)
export default router

import express from "express"
// 引入 删除用户api
import deleted from "@/routes/user/admin/delete"
const router = express.Router()
router.use(deleted)
export default router

import express from "express"
// 引入 删除文章api
import deleted from "@/routes/article/admin/delete"
const router = express.Router()
router.use(deleted)
export default router

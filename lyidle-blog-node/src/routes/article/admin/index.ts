import express from "express"
// 引入 删除文章api
import deleted from "@/routes/article/admin/delete"
// 引入修改函数
import updated from "@/routes/article/admin/update"
const router = express.Router()
// 挂载函数
router.use(deleted)
router.use("/update", updated)

export default router

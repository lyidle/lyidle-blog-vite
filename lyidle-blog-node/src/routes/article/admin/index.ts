import express from "express"
// 引入 删除文章api
import deleted from "@/routes/article/admin/delete"
// 引入修改函数
import updated from "@/routes/article/admin/update"
// 引入增加api
import addArticle from "@/routes/article/admin/addArticle"
// 引入 jwt
import { jwt } from "@/middleware/auth"
const router = express.Router()
// 挂载函数
router.use(deleted)
router.use("/add", jwt, addArticle)
router.use("/update", updated)

export default router

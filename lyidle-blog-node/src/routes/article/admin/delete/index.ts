import express from "express"
// 引入api
import userClear from "@/routes/article/admin/delete/clear"
import userBin from "@/routes/article/admin/delete/bin"
const router = express.Router()
// 挂载api
router.use("/clear", userClear)
router.use("/bin", userBin)
export default router

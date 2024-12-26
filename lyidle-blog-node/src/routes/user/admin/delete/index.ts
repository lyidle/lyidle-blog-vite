import express from "express"
// 引入api
import userClear from "@/routes/user/admin/delete/clear"
import userBin from "@/routes/user/admin/delete/bin"
const router = express.Router()
router.use("/clear", userClear)
router.use("/bin", userBin)
export default router

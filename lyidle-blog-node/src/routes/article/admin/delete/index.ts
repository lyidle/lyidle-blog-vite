import express from "express"
import userClear from "@/routes/article/admin/delete/clear"
import userBin from "@/routes/article/admin/delete/bin"
const router = express.Router()
router.use("/clear", userClear)
router.use("/bin", userBin)
export default router

import express from "express"
// 引入api
import userClear from "@/routes/article/admin/delete/clear"
import userBin from "@/routes/article/admin/delete/bin"
// 引入jwt
import { jwt } from "@/middleware/auth"
const router = express.Router()
// 挂载api
router.use("/clear", jwt, userClear)
router.use("/bin", jwt, userBin)
export default router

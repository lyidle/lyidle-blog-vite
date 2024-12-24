import express from "express"
// 引入api
import userClear from "@/routes/user/admin/delete/clear"
import userBin from "@/routes/user/admin/delete/bin"
// 引入 jwt
import { jwt } from "@/middleware/auth"
const router = express.Router()
router.use("/clear", jwt, userClear)
router.use("/bin", jwt, userBin)
export default router

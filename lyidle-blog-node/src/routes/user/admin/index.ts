import express from "express"
// 引入 删除用户api
import deleted from "@/routes/user/admin/delete"
import update from "@/routes/user/admin/update"
// 引入 jwt
import { jwt } from "@/middleware/auth"
const router = express.Router()
// 挂载api
router.use(jwt, deleted)
router.use("/update", jwt, update)
export default router

import express from "express"
// 引入 /api/initial/webInfo
import initialWebInfo from "@/routes/admin/initial/webInfo"
const router = express.Router()
router.use("/webInfo", initialWebInfo)
// 挂载路由
export default router

import { Router } from "express"
// 引入 注册路由
import reg from "@/routes/email/reg"
const router = Router()
router.use("/reg", reg)
export default router

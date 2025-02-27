import express from "express"
// 引入 /admin/bannerImg/recycle
import recycle from "./recycle"
// 引入 /admin/bannerImg/restore
import restore from "./restore"
const router = express.Router()
// 挂载 api
router.use("/recycle", recycle)
router.use("/restore", restore)
export default router

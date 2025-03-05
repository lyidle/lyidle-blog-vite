import express from "express"
// 引入 api
import get from "./get"
import restore from "./restore"

const router = express.Router()
// 挂载路由
router.use("/", get)
router.use("/restore", restore)
export default router

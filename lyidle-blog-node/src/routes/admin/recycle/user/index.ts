import express from "express"
// 引入 api
import get from "./get"

const router = express.Router()
// 挂载路由
router.use("/", get)
export default router

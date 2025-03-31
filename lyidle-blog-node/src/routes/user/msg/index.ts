import express from "express"
// 引入 api
import reply from "./reply"

const router = express.Router()
// 挂载路由
router.use("/reply", reply)
export default router

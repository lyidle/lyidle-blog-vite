import express from "express"
// 引入 api
import time from "./time"
const router = express.Router()
// 挂载 api
router.use("/time", time)
export default router
